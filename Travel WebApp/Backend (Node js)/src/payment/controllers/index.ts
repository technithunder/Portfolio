import { Request, Response } from 'express';
import { HTTP_STATUS_CODES, sendResponse } from '@/constants/api-response';
import { createOrderSchema, updatePaymentSchema } from '../validations/payment.request.validation';
import logger from '@/utils/logger';
import Order from '../models/Order';
import VisaDetails from '@/admin/country/models/VisaDetails';
import User from '@/auth/model/User';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { CustomRequest } from '@/middleware/authenticatUser';
import { VisaApplication, VisaApplicationStatus } from '@/visaApplication/model';

// Define RazorpayPayment interface
interface RazorpayPayment {
    id: string;
    amount: number;
    status: string;
    order_id: string;
}

const razorpay = new Razorpay({
    key_id: process.env.PAYMENT_KEY_ID!,
    key_secret: process.env.PAYMENT_KEY_SECRET!
});

export namespace PaymentController {
    export const createPayment = async (req: CustomRequest, res: Response) => {
        try {
            const { error } = createOrderSchema.validate(req.body);
            if (error) {
                return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const { visaId, childUsers, applicationId } = req.body;
            const userId = req.user?.id;

            // Get visa details to calculate amount
            const visaDetails = await VisaDetails.findByPk(visaId);
            if (!visaDetails) {
                return sendResponse(res, false, null, null, 'Visa not found', HTTP_STATUS_CODES.NOT_FOUND);
            }

            const visaFee = (visaDetails.visaDetails as { visaFee: number }).visaFee;
            const vizayardFee = (visaDetails.visaDetails as { vizayardFee: number }).vizayardFee;
            const totalAmount = (visaFee + vizayardFee) * childUsers.length;

            // Create Razorpay order
            const razorpayOrder = await razorpay.orders.create({
                amount: totalAmount * 100, // Amount in smallest currency unit (paise)
                currency: 'INR',
                receipt: `receipt_${Date.now()}`
            });

            // Get user details
            const user = await User.findByPk(userId);
            if (!user) {
                return sendResponse(res, false, null, null, 'User not found', HTTP_STATUS_CODES.NOT_FOUND);
            }

            // Create order in database
            await Order.create({
                userId,
                visaId,
                amount: totalAmount,
                orderId: razorpayOrder.id,
                status: razorpayOrder.status,
                applicationId
            });

            const response = {
                amount: totalAmount,
                orderId: razorpayOrder.id,
                user: {
                    email: user.email,
                    phoneNumber: user.phoneNumber
                }
            };

            return sendResponse(res, true, response, 'Order created successfully', null, HTTP_STATUS_CODES.CREATED);
        } catch (error) {
            logger.error('Error in createPayment:', error);
            return sendResponse(res, false, null, null, 'Failed to create payment', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };

    export const updatePayment = async (req: Request, res: Response) => {
        try {
            const { error } = updatePaymentSchema.validate(req.body);
            if (error) {
                return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
            }

            const { orderId, paymentId, signatureId, description } = req.body;

            const order = await Order.findOne({ where: { orderId } });
            
            if (!order) {
                return sendResponse(res, false, null, null, 'Order not found', HTTP_STATUS_CODES.NOT_FOUND);
            }

            // Verify the payment signature
            const body = orderId + '|' + paymentId;
            const expectedSignature = crypto.createHmac('sha256', process.env.PAYMENT_KEY_SECRET!).update(body.toString()).digest('hex');

            // Check if the signature matches
            const isSignatureValid = expectedSignature === signatureId;

            if (!isSignatureValid) {
                return sendResponse(res, false, null, null, 'Invalid payment signature', HTTP_STATUS_CODES.BAD_REQUEST);
            }

            // Verify payment details with Razorpay
            try {
                const payment = (await razorpay.payments.fetch(paymentId)) as RazorpayPayment;

                // Convert both amounts to numbers for comparison
                const razorpayAmount = Number(payment.amount) / 100;
                const orderAmount = Number(order.amount);

                // Verify if payment amount matches order amount
                if (razorpayAmount !== orderAmount) {
                    return sendResponse(res, false, null, null, 'Payment amount mismatch', HTTP_STATUS_CODES.BAD_REQUEST);
                }

                // Verify payment status
                if (payment.status !== 'captured') {
                    return sendResponse(res, false, null, null, 'Payment not captured', HTTP_STATUS_CODES.BAD_REQUEST);
                }

                // Update order only if payment is verified
                await order.update({
                    paymentId,
                    signatureId,
                    status: payment.status,
                    description
                });
                
                if (order.applicationId) {
                    const application = await VisaApplication.findByPk(order.applicationId);
                    let newStatus = '';
                if (application && application.status !== 'under-review') {
                    newStatus = 'under-review';
                } else if (!application && application.status !== 'payment-pending') {
                    newStatus = 'payment-pending';
                }
            
                if (newStatus) {
                      await application.update({ status: newStatus });
                  
                      await VisaApplicationStatus.create({
                        appId: application.id,
                        status: newStatus,
                        changedBy: 1,
                        changedAt: new Date()
                      });
                    }
                }
                return sendResponse(res, true, order, 'Payment verified and updated successfully', null, HTTP_STATUS_CODES.OK);
            } catch (razorpayError) {
                logger.error('Error verifying payment with Razorpay:', razorpayError);
                return sendResponse(res, false, null, null, 'Failed to verify payment with Razorpay', HTTP_STATUS_CODES.BAD_REQUEST);
            }
        } catch (error) {
            logger.error('Error in updatePayment:', error);
            return sendResponse(res, false, null, null, 'Failed to update payment', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
        }
    };
}
