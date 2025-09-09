import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface EmailPayload {
  email: string;
  subject: string;
  message: string;
}

const sendEmail = async (payload: EmailPayload): Promise<void> => {
  const transporter = nodemailer.createTransport({
    port: 465,
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.MAILPASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: payload.email,
    subject: payload.subject,
    html: payload.message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
