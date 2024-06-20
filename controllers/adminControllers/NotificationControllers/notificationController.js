/*import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import asyncHandler from "express-async-handler"
import { error } from 'neo4j-driver';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendNotificationEmail = async (req, res) => {
   const {to, subject, text } = req.body
    const mailOptions = {
    
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };


  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent');
    res.send(" Email has been sent");
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.send("Could'nt send.");
  }
};
*/

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import asyncHandler from "express-async-handler"
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
    //as first emails were imported using emample.com but later changed. so this is not called
    return email.replace("@example.com", "@gmail.com");
}

export const sendNotificationEmail = async (req, res) => {
  try {
    //cypher query to get all amail adresses
    const query = `
      MATCH (admin:Admin)
      RETURN admin.email AS email
    `;
    const result = await driver.executeQuery(query);

    //log the query result
    console.log("Query Result:", result);

    const admins = parser.parse(result);

    //log retrieved email address for debugging
    console.log("Admin Emails:", admins.map(admin => admin.email));

    //sending notif to each admin
    const promises = admins.map(async (admin) => {

        //checking if email is undefined
        if (!admin || !admin.email) {
            console.log("Admin email is undefined. Skipping...");
            return; 
        }

        
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: req.body.subject,
        text: req.body.text,
      };

      await transporter.sendMail(mailOptions);
    });

    
    await Promise.all(promises);

    console.log('Emails sent to all admins');
    res.send("Emails have been sent to all admins");
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send("Couldn't send emails to admins.");
  }
};
