
import createHttpError from "http-errors";
import { config } from "../config/config.js";
import axios from "axios"

export const fetchTwilioMessageStatus = async (url) => {
        try{
            const base64Credentials = btoa(`${config.twilioAccountSid}:${config.twilioAuthToken}`);
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Basic ${base64Credentials}`
                }
            });

            return response.data;
        } catch(err){
            throw createHttpError(500, err.message)
        }
}

