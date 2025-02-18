import nodemailer from "nodemailer";
import { config } from "../config/config.js";
import createHttpError from "http-errors";

const transporter = nodemailer.createTransport({
  service: config.nodemailerService, 
  auth: {
    user: config.nodemailerUser, 
    pass: config.nodemailerPassword,  
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    const emailBody = `
    <html>
    <head>
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f4f4f4;
            }
        </style>
    </head>
    <body>
        <h2>Welcome to Cryptexams, ${text.name}!</h2>
        <p>Your account details are as follows:</p>
        <table>
            <tr><th>Name:</th><td>${text.name}</td></tr>
            <tr><th>Email:</th><td>${text.email}</td></tr>
            <tr><th>Password:</th><td>${text.password}</td></tr>
            <tr><th>Mobile:</th><td>${text.mobile}</td></tr>
        </table>
        <p>Please keep your login credentials safe.</p>
    </body>
    </html>
`;

    const mailOptions = {
      from: config.nodemailerUser,
      to,
      subject,
      html: emailBody, 
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw createHttpError(500, error.message);
  }
};




