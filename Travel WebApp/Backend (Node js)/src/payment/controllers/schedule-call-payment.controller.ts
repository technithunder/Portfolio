import { Request, Response } from 'express';
import { HTTP_STATUS_CODES, sendResponse } from '@/constants/api-response';
import { createScheduleCallPaymentSchema, updateScheduleCallPaymentSchema } from '../validations/schedule-call-payment.validation';
import logger from '@/utils/logger';
import ScheduleCallOrder from '../models/ScheduleCallOrder';
import ScheduledCall from '@/scheduledCall/models/ScheduledCall';
import User from '@/auth/model/User';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { GoogleCalendarService } from '@/utils/googleCalendar';
import * as nodemailer from 'nodemailer';

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.PAYMENT_KEY_ID!,
    key_secret: process.env.PAYMENT_KEY_SECRET!
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export namespace ScheduleCallPaymentController {
    export const createPayment = async (req: any, res: Response) => {
        try {
            const { error } = createScheduleCallPaymentSchema.validate(req.body);
            if (error) {
                return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const { scheduleCallId, amount } = req.body;
            const userId = req.user?.id;

            // Verify scheduled call exists
            const scheduledCall = await ScheduledCall.findByPk(scheduleCallId);
            if (!scheduledCall) {
                return sendResponse(res, false, null, null, 'Scheduled call not found', HTTP_STATUS_CODES.NOT_FOUND);
            }

            // Create Razorpay order
            const razorpayOrder = await razorpay.orders.create({
                amount: amount * 100, // Amount in smallest currency unit (paise)
                currency: 'INR',
                receipt: `receipt_schedule_${Date.now()}`
            });

            // Get user details
            const user = await User.findByPk(userId);
            if (!user) {
                return sendResponse(res, false, null, null, 'User not found', HTTP_STATUS_CODES.NOT_FOUND);
            }

            // Create schedule call order in database
            await ScheduleCallOrder.create({
                userId,
                scheduleCallId,
                amount,
                orderId: razorpayOrder.id,
                status: razorpayOrder.status
            });

            const response = {
                amount,
                orderId: razorpayOrder.id,
                user: {
                    email: user.email,
                    phoneNumber: user.phoneNumber
                }
            };

            return sendResponse(res, true, response, 'Schedule call order created successfully', null, HTTP_STATUS_CODES.CREATED);
        } catch (error) {
            logger.error('Error in createScheduleCallPayment:', error);
            return sendResponse(res, false, null, null, 'Failed to create schedule call payment', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const updatePayment = async (req: Request, res: Response) => {
        let scheduledCall = null;
        try {
            const { error } = updateScheduleCallPaymentSchema.validate(req.body);
            if (error) {
                return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const { orderId, paymentId, signatureId } = req.body;

            const order = await ScheduleCallOrder.findOne({ where: { orderId } });
            if (!order) {
                return sendResponse(res, false, null, null, 'Order not found', HTTP_STATUS_CODES.NOT_FOUND);
            }

            // Fetch the scheduled call details early so we can delete it if payment fails
            scheduledCall = await ScheduledCall.findByPk(order.scheduleCallId);
            if (!scheduledCall) {
                return sendResponse(res, false, null, null, 'Scheduled call not found', HTTP_STATUS_CODES.NOT_FOUND);
            }

            // Verify the payment signature
            const body = orderId + '|' + paymentId;
            const expectedSignature = crypto.createHmac('sha256', process.env.PAYMENT_KEY_SECRET!).update(body.toString()).digest('hex');

            // Check if the signature matches
            const isSignatureValid = expectedSignature === signatureId;

            if (!isSignatureValid) {
                // Delete scheduled call if signature is invalid
                await scheduledCall.destroy();
                return sendResponse(res, false, null, null, 'Invalid payment signature', HTTP_STATUS_CODES.BAD_REQUEST);
            }

            // Verify payment details with Razorpay
            try {
                const payment = await razorpay.payments.fetch(paymentId);

                // Convert amounts for comparison
                const razorpayAmount = Number(payment.amount) / 100;
                const orderAmount = Number(order.amount);

                if (razorpayAmount !== orderAmount) {
                    // Delete scheduled call if amount doesn't match
                    await scheduledCall.destroy();
                    return sendResponse(res, false, null, null, 'Payment amount mismatch', HTTP_STATUS_CODES.BAD_REQUEST);
                }

                if (payment.status !== 'captured') {
                    // Delete scheduled call if payment is not captured
                    await scheduledCall.destroy();
                    return sendResponse(res, false, null, null, 'Payment not captured', HTTP_STATUS_CODES.BAD_REQUEST);
                }

                // Update order if payment is verified
                await order.update({
                    paymentId,
                    signatureId,
                    status: payment.status
                });

                // Create Google Meet link and update calendar
                try {
                    // Parse the date and time slot
                    const [startTime] = scheduledCall.timeSlot.split('-');
                    const [hours, minutes] = startTime.split(':');
                    const startDateTime = new Date(scheduledCall.date);
                    startDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
                    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Add 1 hour

                    // Create calendar event with Google Meet
                    const event = await GoogleCalendarService.createMeeting({
                        summary: `Consultation Call with ${scheduledCall.userName}`,
                        description: scheduledCall.description || 'Scheduled consultation call',
                        startDateTime: startDateTime,
                        endDateTime: endDateTime,
                        attendeeEmail: scheduledCall.userEmail
                    });

                    // Update scheduled call with meet link and event ID
                    await scheduledCall.update({
                        meetLink: event.meetLink,
                        eventId: event.eventId
                    });

                    // Send confirmation email
                    const mailOptions = {
                        from: process.env.EMAIL_USER,
                        to: scheduledCall.userEmail,
                        subject: 'Scheduled Call Confirmation',
                        html: `
                            <h1>Your Call Has Been Scheduled</h1>
                            <p>Dear ${scheduledCall.userName},</p>
                            <p>Your consultation call has been scheduled for ${scheduledCall.date} at ${scheduledCall.timeSlot}.</p>
                            <p>Please join the call using this Google Meet link: <a href="${event.meetLink}">${event.meetLink}</a></p>
                            <p>We look forward to speaking with you!</p>
                        `
                    };

                    await transporter.sendMail(mailOptions);

                    return sendResponse(
                        res,
                        true,
                        { ...order.toJSON(), meetLink: event.meetLink },
                        'Payment verified and meeting scheduled successfully',
                        null,
                        HTTP_STATUS_CODES.OK
                    );
                } catch (googleError) {
                    // Delete scheduled call if Google Meet creation fails
                    logger.error('Error creating Google Meet:', googleError);
                    return sendResponse(
                        res,
                        false,
                        null,
                        null,
                        'Payment successful but failed to create meeting',
                        HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR
                    );
                }
            } catch (razorpayError) {
                // Delete scheduled call if Razorpay verification fails
                if (scheduledCall) {
                    await scheduledCall.destroy();
                }
                logger.error('Error verifying payment with Razorpay:', razorpayError);
                return sendResponse(res, false, null, null, 'Failed to verify payment with Razorpay', HTTP_STATUS_CODES.BAD_REQUEST);
            }
        } catch (error) {
            logger.error('Error in updateScheduleCallPayment:', error);
            return sendResponse(res, false, null, null, 'Failed to update schedule call payment', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };
}
