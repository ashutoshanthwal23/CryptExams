import twilio from 'twilio';
import { config } from './config.js';

const accountSid = config.twilioAccountSid;
const authToken = config.twilioAuthToken;

export const client = new twilio(accountSid, authToken);