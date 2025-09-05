import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export class GoogleCalendarService {
    private static oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

    private static calendar = google.calendar({
        version: 'v3',
        auth: GoogleCalendarService.oauth2Client
    });

    private static async setupCredentials() {
        this.oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });
    }

    public static async createMeeting(params: {
        summary: string;
        description: string;
        startDateTime: Date;
        endDateTime: Date;
        attendeeEmail: string;
    }): Promise<{ meetLink: string; eventId: string }> {
        try {
            await this.setupCredentials();

            const event = {
                summary: params.summary,
                description: params.description,
                start: {
                    dateTime: params.startDateTime.toISOString(),
                    timeZone: 'Asia/Kolkata'
                },
                end: {
                    dateTime: params.endDateTime.toISOString(),
                    timeZone: 'Asia/Kolkata'
                },
                attendees: [{ email: params.attendeeEmail }],
                conferenceData: {
                    createRequest: {
                        requestId: `${Date.now()}`,
                        conferenceSolutionKey: { type: 'hangoutsMeet' }
                    }
                }
            };

            const createdEvent = await this.calendar.events.insert({
                calendarId: 'primary',
                conferenceDataVersion: 1,
                requestBody: event
            });

            return {
                meetLink: createdEvent.data.conferenceData?.entryPoints?.[0]?.uri || '',
                eventId: createdEvent.data.id || ''
            };
        } catch (error) {
            console.error('Error creating Google Calendar event:', error);
            throw error;
        }
    }

    public static async updateMeeting(params: {
        eventId: string;
        summary: string;
        description: string;
        startDateTime: Date;
        endDateTime: Date;
        attendeeEmail: string;
    }): Promise<string> {
        try {
            await this.setupCredentials();

            const event = {
                summary: params.summary,
                description: params.description,
                start: {
                    dateTime: params.startDateTime.toISOString(),
                    timeZone: 'Asia/Kolkata'
                },
                end: {
                    dateTime: params.endDateTime.toISOString(),
                    timeZone: 'Asia/Kolkata'
                },
                attendees: [{ email: params.attendeeEmail }]
            };

            const updatedEvent = await this.calendar.events.patch({
                calendarId: 'primary',
                eventId: params.eventId,
                requestBody: event
            });

            return updatedEvent.data.conferenceData?.entryPoints?.[0]?.uri || '';
        } catch (error) {
            console.error('Error updating Google Calendar event:', error);
            throw error;
        }
    }

    public static async deleteMeeting(eventId: string): Promise<void> {
        try {
            await this.setupCredentials();

            await this.calendar.events.delete({
                calendarId: 'primary',
                eventId: eventId
            });
        } catch (error) {
            console.error('Error deleting Google Calendar event:', error);
            throw error;
        }
    }
}
