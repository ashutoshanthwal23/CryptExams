import createHttpError from "http-errors";
import { config } from "../config/config.js";
import { client } from "../config/twilio.js"
import Test from "../models/test.js";


const saveMessageStatusFeedback = async (statusList, testId) => {
    try{
        const test = await Test.findById(testId);

        for (const elem of statusList) {
            test.sendMessageStatus.push({ ...elem });
        }
        await test.save();
        
    } catch(err){
        throw createHttpError(500, err.message);
    }
};


export const sendMessageByTwilio = async (studentsList, questionPaperPassword, testId) => {
    let msgString = `Your test details:\nTest ID: ${testId}\nPassword: ${questionPaperPassword}\n`;

    const statusArray = [];
    try{
        for(const student of studentsList){
            const response = await client.messages.create({
                body: `${msgString}RollNumber: ${student.rollNumber}`,
                from: config.twilioNumber,
                to: "+91" + student.mobile
            });

            const options = {
                rollNumber: student.rollNumber,
                uri: response.uri,
                sid: response.sid
            }

            statusArray.push(options);
        }

        if(statusArray.length === studentsList.length){
            await saveMessageStatusFeedback(statusArray, testId);
        }

    } catch(err){
        console.log(err);
        throw createHttpError(500, err.message)
    }
        
}