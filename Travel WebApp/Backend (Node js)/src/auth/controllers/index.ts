import { HTTP_STATUS_CODES, sendResponse } from '@/constants/api-response';
import { strings } from '@/constants/string.constants';
import { updateUserSchema, userSchema, verifyOtpSchema, } from '@/auth/validations/user.request.validation';
import { Request, Response } from 'express';
import { getDBErrorMessage } from '@/utils/db.error';
import Users from '@/auth/model/User';
import logger from '@/utils/logger';
import dotenv from 'dotenv';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import { uploadToS3Bucket } from '@/utils/aws';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

dotenv.config();

export namespace AuthController {

  // Health Check Route
  export const HealthRoute = async (req: Request, res: Response) => {
    sendResponse(res, true, strings.welcome_message, null, null, HTTP_STATUS_CODES.OK);
  };

  export const loginUser = async (req: Request, res: Response) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
    }
    const { phoneNumber, countryCode } = req.body
    try {

      // const response = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verifications.create({
      //   to: `${countryCode}${phoneNumber}`,
      //   channel: 'sms'
      // });
      return sendResponse(res, true, { "status": true }, strings.otp_send, null, HTTP_STATUS_CODES.OK);
    } catch (error) {
      logger.error('Error in login user:', error);
      return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  export const verifyOtp = async (req: Request, res: Response) => {
    const { error } = verifyOtpSchema.validate(req.body);
    if (error) {
      return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
    }

    const { phoneNumber, code, countryCode } = req.body;

    try {
      // const response = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      //   .verificationChecks.create({
      //     to: `${countryCode}${phoneNumber}`,
      //     code
      //   });

      // if (response.status !== 'approved') {
      //   return sendResponse(res, false, null, null, strings.invalid_otp, HTTP_STATUS_CODES.BAD_REQUEST);
      // }
      if (code !== '123456') {
        return sendResponse(res, false, null, null, strings.invalid_otp, HTTP_STATUS_CODES.BAD_REQUEST);
      }


      let user = await Users.findOne({ where: { phoneNumber } });

      const role = 'user';

      if (!user) {
        await Users.create({ phoneNumber });
        user = await Users.findOne({ where: { phoneNumber } });
      }

      const token = jwt.sign(
        { id: user.id, phoneNumber: user.phoneNumber, role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: Number(process.env.JWT_EXPIRY_TIME) || 3600 }
      );

      const data = {
        user: {
          id: user.id,
          phoneNumber: user.phoneNumber,
          email: user.email || null,
          userImageUrl: user.photo || null,
          city: user.city || null,
          alternateNo: user.alternateNo || null,
          token,
          firstName: user.firstName,
          lastName: user.lastName,
          passportFront: user.passportFront || null,
          passportBack: user.passportBack || null,
          incomeTaxReturn: user.incomeTaxReturn || null,
          adharCard: user.adharCard || null,
          panCard: user.panCard || null,
        },
      };

      return sendResponse(res, true, data, strings.otp_verified, null, HTTP_STATUS_CODES.OK);
    } catch (error) {
      logger.error('Invalid service ID or error verifying OTP', error);
      return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  };


  export const updateUser = async (req: Request, res: Response) => {
    const { error } = updateUserSchema.validate(req.body);
    if (error) {
      return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
    }

    const { id } = req.query;
    const { phoneNumber, email, city, alternateNo, userPhoto, passportFront, passportBack, incomeTaxReturn, adharCard, panCard, firstName, lastName } = req.body;

    let userImageUrl: string | null = null;
    let passportFrontUrl: string | null = null;
    let passportBackUrl: string | null = null;
    let incomeTaxReturnUrl: string | null = null;
    let adharCardUrl: string | null = null;
    let panCardUrl: string | null = null;

    try {
      if (userPhoto) {
        userImageUrl = /^https?:\/\//.test(userPhoto) ? userPhoto : (await uploadToS3Bucket(userPhoto)).s3FileUrl;
      }

      if (passportFront) {
        passportFrontUrl = /^https?:\/\//.test(passportFront) ? passportFront : (await uploadToS3Bucket(passportFront)).s3FileUrl;
      }

      if (passportBack) {
        passportBackUrl = /^https?:\/\//.test(passportBack) ? passportBack : (await uploadToS3Bucket(passportBack)).s3FileUrl;
      }

      if (incomeTaxReturn) {
        incomeTaxReturnUrl = /^https?:\/\//.test(incomeTaxReturn) ? incomeTaxReturn : (await uploadToS3Bucket(incomeTaxReturn)).s3FileUrl;
      }

      if (adharCard) {
        adharCardUrl = /^https?:\/\//.test(adharCard) ? adharCard : (await uploadToS3Bucket(adharCard)).s3FileUrl;
      }

      if (panCard) {
        panCardUrl = /^https?:\/\//.test(panCard) ? panCard : (await uploadToS3Bucket(panCard)).s3FileUrl;
      }

      const user: any = await Users.findOne({ where: { id } });
      if (!user) {
        return sendResponse(res, false, null, null, strings.user_not_found, HTTP_STATUS_CODES.BAD_REQUEST);
      }

      await user.update({
        phoneNumber,
        email,
        city,
        alternateNo,
        firstName,
        lastName,
        photo: userImageUrl || user.photo,
        passportFront: passportFrontUrl || user.passportFront || '',
        passportBack: passportBackUrl || user.passportBack || '',
        incomeTaxReturn: incomeTaxReturnUrl || user.incomeTaxReturn || '',
        adharCard: adharCardUrl || user.adharCard || '',
        panCard: panCardUrl || user.panCard || '',
      });

      const updatedUser = await Users.findOne({ where: { id } });
      if (!updatedUser) {
        return sendResponse(res, false, null, null, strings.user_not_found, HTTP_STATUS_CODES.BAD_REQUEST);
      }

      await user.update({
        phoneNumber,
        email,
        city,
        alternateNo,
        firstName,
        lastName,
        photo: userImageUrl || user.photo,
        passportFront: passportFrontUrl || user.passportFront,
        passportBack: passportBackUrl || user.passportBack,
        incomeTaxReturn: incomeTaxReturnUrl || user.incomeTaxReturn,
        adharCard: adharCardUrl || user.adharCard,
        panCard: panCardUrl || user.panCard,
      });

      // Return updated data
      const data = {
        id: updatedUser.id,
        phoneNumber: updatedUser.phoneNumber,
        email: user.email,
        city: user.city,
        alternateNo: user.alternateNo,
        firstName: user.firstName,
        lastName: user.lastName,
        userImageUrl: user.photo,
        passportFront: user.passportFront,
        passportBack: user.passportBack,
        incomeTaxReturn: user.incomeTaxReturn,
        adharCard: user.adharCard,
        panCard: user.panCard,
      };

      return sendResponse(res, true, data, strings.user_updated, null, HTTP_STATUS_CODES.OK);
    } catch (error) {
      logger.error('Error in updateUser:', error);
      return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  };

  export const resendOtp = async (req: Request, res: Response) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
    }
    const { phoneNumber, countryCode } = req.body
    try {
      const user = await Users.findOne({ where: { phoneNumber } })
      if (!user) {
        return sendResponse(res, false, null, null, strings.user_not_found, HTTP_STATUS_CODES.BAD_REQUEST)
      }
      const response = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID).verifications.create({
        to: `${countryCode}${phoneNumber}`,
        channel: 'sms'
      });

      return sendResponse(res, true, response, strings.otp_send, null, HTTP_STATUS_CODES.OK);
    } catch (error) {
      logger.error('Error in resend otp:', error);
      return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

  export const sendWhatsAppMessage = async (req: Request, res: Response) => {
    console.log("in whp api")
    // const { error } = userSchema.validate(req.body);
    // if (error) {
    // return sendResponse(res, false, null, null, error.details[0].message, HTTP_STATUS_CODES.BAD_REQUEST);
    // }
    const { phoneNumber, countryCode } = req.body
    try {
      let responseData;
      responseData = await client.messages.create({
        to: `whatsapp:${countryCode}${phoneNumber}`,
        from: process.env.TWILIO_WHATSAPP_NUMBER,
        body: 'Hello, this is a message sent from Vizayard'
      })
      console.log(responseData)
      // const user = await Users.findOne({ where: { phoneNumber } })
      // if (!user) {
      //   return sendResponse(res, false, null, null, strings.user_not_found, HTTP_STATUS_CODES.BAD_REQUEST)
      // }
      // const response = await client.messages.create({
      //   from: process.env.TWILIO_WHATSAPP_NUMBER,
      //   to: `whatsapp:${countryCode}${phoneNumber}`,
      //   body: 'Hello from Visayard!',
      // });


      return sendResponse(res, true, responseData, strings.otp_send, null, HTTP_STATUS_CODES.OK);
    } catch (error) {
      logger.error('Error in resend otp:', error);
      return sendResponse(res, false, null, null, getDBErrorMessage(error), HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  }

}
