import { ACCOOUNT_SID, AUTH_TOKEN } from "../config";

const accountSid = ACCOOUNT_SID;
const authToken = AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendMessge = (to, body) => {
  return client.messages
    .create({
      body: body,
      from: "whatsapp:+14155238886",
      to: to,
    })
    .then((message) => console.log(message.sid));
};
