

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import asyncHandler from "express-async-handler";
import driver from "../../../utils/neo4j-driver.js";
import parser from "parse-neo4j";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function replaceDomain(email) {
  return email.replace("@example.com", "@gmail.com");
}

export const sendNotificationEmail = async (req, res) => {
  try {
    //cypher query to get all email addresses
    const query = `
      MATCH (admin:Admin)
      RETURN admin.email AS email
    `;

    const session = driver.session();
    const result = await session.run(query);
    await session.close();

    //log raw query result
    console.log("Raw Query Result:", result);

    const admins = parser.parse(result);

    //log parsed result
    console.log("Parsed Admins:", admins);

    //sending notification to each admin
    const promises = admins.map(async (email) => {
      // Checking if email is undefined, happens if in neo4j separate property not defined as email
      if (!email) {
        console.log("Admin email is undefined. Skipping...");
        return;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: replaceDomain(email),
        subject: req.body.subject,
        text: req.body.text,
      };

      await transporter.sendMail(mailOptions);
    });

    
    await Promise.all(promises);

    console.log('Emails sent to all admins');
    res.send("Emails have been sent to all admins");
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send("Couldn't send emails to admins.");
  }
};
