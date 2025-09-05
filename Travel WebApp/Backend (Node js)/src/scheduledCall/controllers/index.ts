import { Request, Response } from 'express';
import { HTTP_STATUS_CODES, sendResponse } from '@/constants/api-response';
import { scheduleCallSchema, updateScheduleCallSchema } from '../validations/scheduledCall.validation';
import ScheduledCall from '../models/ScheduledCall';
import ScheduleCallOrder from '@/payment/models/ScheduleCallOrder';
import { Op } from 'sequelize';
import logger from '@/utils/logger';
import * as nodemailer from 'nodemailer';
import { GoogleCalendarService } from '@/utils/googleCalendar';
import ScheduleCallAmount from '@/admin/scheduleCallAmount/models/scheduleCallAmount';

function getTimeDurationFromSlot(slot: string): number {
    const [start, end] = slot.split('-');
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    return endTotalMinutes - startTotalMinutes;
}
// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

interface AuthRequest extends Request {
    user?: {
        id: number;
        user_name: string;
        role: string;
    };
}
export namespace ScheduledCallController {

    export const bookCall = async (req: AuthRequest, res: Response) => {
        try {
            const { error } = scheduleCallSchema.validate(req.body);
            if (error) {
                return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const { date, timeSlot, userName, userPhone, userEmail, description } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                return sendResponse(res, false, null, null, 'User not authenticated', HTTP_STATUS_CODES.UNAUTHORIZED);
            }

            const duration = getTimeDurationFromSlot(timeSlot);
            const amountData = await ScheduleCallAmount.findOne({
                where: { timeDuration: duration.toString() }
            });

            if (!amountData) {
                return sendResponse(res, false, null, null, `No price configured for ${duration}-minute slot`, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const existingBooking = await ScheduledCall.findOne({
                where: {
                    date,
                    timeSlot,
                }
            });

            if (existingBooking) {
                return sendResponse(res, false, null, null, 'This time slot is already booked', HTTP_STATUS_CODES.CONFLICT);
            }

            const scheduledCall = await ScheduledCall.create({
                userId,
                date,
                timeSlot,
                userName,
                userPhone,
                userEmail,
                description,
                meetLink: null,
                eventId: null
            });

            const scheduledCallWithAmount = {
                ...scheduledCall.toJSON(),
                amount: amountData.amount
            };
            return sendResponse(res, true, scheduledCallWithAmount, 'Call scheduled successfully, pending payment', null, HTTP_STATUS_CODES.CREATED);
        } catch (error) {
            console.log(error)
            logger.error('Error in bookCall:', error);
            return sendResponse(res, false, null, null, 'Failed to schedule call', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const getUserCalls = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return sendResponse(res, false, null, null, 'User not authenticated', HTTP_STATUS_CODES.UNAUTHORIZED);
            }

            const calls = await ScheduledCall.findAll({
                where: {
                    userId,
                    meetLink: { [Op.ne]: null }
                },
                order: [
                    ['date', 'ASC'],
                    ['timeSlot', 'ASC']
                ]
            });

            return sendResponse(res, true, calls, 'User calls retrieved successfully', null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            logger.error('Error in getUserCalls:', error);
            return sendResponse(res, false, null, null, 'Failed to retrieve user calls', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const updateCall = async (req: AuthRequest, res: Response) => {
        try {
            const { error } = updateScheduleCallSchema.validate(req.body);
            if (error) {
                return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const { id } = req.params;
            const { date, timeSlot, userName, userPhone, userEmail, description } = req.body;
            const userId = req.user?.id;

            if (!userId) {
                return sendResponse(res, false, null, null, 'User not authenticated', HTTP_STATUS_CODES.UNAUTHORIZED);
            }

            const scheduledCall = await ScheduledCall.findOne({
                where: {
                    id,
                    userId
                }
            });

            if (!scheduledCall) {
                return sendResponse(res, false, null, null, 'Scheduled call not found', HTTP_STATUS_CODES.NOT_FOUND);
            }

            // Check if payment is successful for this scheduled call
            const payment = await ScheduleCallOrder.findOne({
                where: {
                    scheduleCallId: id,
                    status: 'captured'
                }
            });

            if (!payment) {
                return sendResponse(res, false, null, null, 'Cannot update call details before successful payment', HTTP_STATUS_CODES.FORBIDDEN);
            }

            // Check if the new time slot is available (if changing time)
            if (date !== scheduledCall.date || timeSlot !== scheduledCall.timeSlot) {
                const existingBooking = await ScheduledCall.findOne({
                    where: {
                        date,
                        timeSlot,
                        id: { [Op.ne]: id }
                    }
                });

                if (existingBooking) {
                    return sendResponse(res, false, null, null, 'This time slot is already booked', HTTP_STATUS_CODES.CONFLICT);
                }
            }

            // Update Google Calendar event
            const [startTime, endTime] = timeSlot.split('-');
            const startDateTime = new Date(`${date}T${startTime}`);
            const endDateTime = new Date(`${date}T${endTime}`);

            // Update Google Calendar event with new details
            const updatedMeetLink = await GoogleCalendarService.updateMeeting({
                eventId: scheduledCall.eventId,
                summary: `Visa Consultation Call with ${userName}`,
                description: description || 'Consultation call for visa services',
                startDateTime,
                endDateTime,
                attendeeEmail: scheduledCall.userEmail
            });

            // Update scheduled call record
            await scheduledCall.update({
                date,
                timeSlot,
                userName,
                userPhone,
                userEmail,
                description,
                meetLink: updatedMeetLink || scheduledCall.meetLink
            });

            // Send update email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: userEmail,
                subject: 'Visa Consultation Call Update',
                html: `
                    <h1>Your Call Has Been Updated</h1>
                    <p>Dear ${userName},</p>
                    <p>Your consultation call has been rescheduled.</p>
                    <p><strong>New Date:</strong> ${date}</p>
                    <p><strong>New Time:</strong> ${timeSlot}</p>
                    <p><strong>Meeting Link:</strong> <a href="${updatedMeetLink}">${updatedMeetLink}</a></p>
                    ${description ? `<p><strong>Description:</strong> ${description}</p>` : ''}
                    <p>Please make sure to join the meeting on time using the provided Google Meet link.</p>
                    <p>Best regards,<br>Visayard Team</p>
                `
            };

            await transporter.sendMail(mailOptions);

            return sendResponse(res, true, scheduledCall, 'Call updated successfully', null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            logger.error('Error in updateCall:', error);
            return sendResponse(res, false, null, null, 'Failed to update call', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const deleteCall = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user?.id;

            if (!userId) {
                return sendResponse(res, false, null, null, 'User not authenticated', HTTP_STATUS_CODES.UNAUTHORIZED);
            }

            const scheduledCall = await ScheduledCall.findOne({
                where: {
                    id,
                    userId // Ensure user can only delete their own calls
                }
            });

            if (!scheduledCall) {
                return sendResponse(res, false, null, null, 'Scheduled call not found', HTTP_STATUS_CODES.NOT_FOUND);
            }

            // Delete Google Calendar event
            if (scheduledCall.eventId) {
                await GoogleCalendarService.deleteMeeting(scheduledCall.eventId);
            }

            // Delete the scheduled call
            await scheduledCall.destroy();

            // Send cancellation email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: scheduledCall.userEmail,
                subject: 'Visa Consultation Call Cancelled',
                html: `
                    <h1>Your Call Has Been Cancelled</h1>
                    <p>Dear ${scheduledCall.userName},</p>
                    <p>Your consultation call scheduled for ${scheduledCall.date} at ${scheduledCall.timeSlot} has been cancelled.</p>
                    <p>If you would like to schedule another call, please visit our app.</p>
                    <p>Best regards,<br>Visayard Team</p>
                `
            };

            await transporter.sendMail(mailOptions);

            return sendResponse(res, true, null, 'Call cancelled successfully', null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            logger.error('Error in deleteCall:', error);
            return sendResponse(res, false, null, null, 'Failed to cancel call', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const getAvailableSlots = async (req: Request, res: Response) => {
        try {
            const { date } = req.query;

            if (!date) {
                return sendResponse(res, false, null, null, 'Date is required', HTTP_STATUS_CODES.BAD_REQUEST);
            }

            // Define all possible time slots (9 AM to 6 PM)
            const allTimeSlots = [
                '09:00-10:00',
                '10:00-11:00',
                '11:00-12:00',
                '12:00-13:00',
                '13:00-14:00',
                '14:00-15:00',
                '15:00-16:00',
                '16:00-17:00',
                '17:00-18:00'
            ];

            // Get booked slots for the date
            const bookedCalls = await ScheduledCall.findAll({
                where: {
                    date: {
                        [Op.eq]: date
                    },
                    meetLink: {
                        [Op.ne]: null
                    }
                },
                attributes: ['timeSlot']
            });

            const bookedSlots = bookedCalls.map((call) => call.timeSlot);
            const availableSlots = allTimeSlots.filter((slot) => !bookedSlots.includes(slot));

            return sendResponse(res, true, availableSlots, 'Available slots retrieved successfully', null, HTTP_STATUS_CODES.OK);
        } catch (error) {
            logger.error('Error in getAvailableSlots:', error);
            return sendResponse(res, false, null, null, 'Failed to get available slots', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };
}
