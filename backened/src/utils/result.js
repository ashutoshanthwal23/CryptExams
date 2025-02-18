import createHttpError from "http-errors";
import { fetchTwilioMessageStatus } from "../twilio/messageStatus.js";
import { generateSha256Key } from "./hashing.js";
import { compareTime } from "./utils.js";


const verifyMessageStatus = async (sendMessageStatus) => {
    let statusMap = new Map();
    let count = 0;

    for(const elem of sendMessageStatus){
        const response = await fetchTwilioMessageStatus(`https://api.twilio.com`+elem.uri);
        statusMap.set(elem.rollNumber, [response.status, response.date_sent]);
        count++;
    }
    

    if(count !== sendMessageStatus.length){
        throw createHttpError(500, "message couldn't send to all students");
    }

    return statusMap;
}

export const getResult = async (keyArray, answerPdfArray, startTime, endTime, examDate, sendMessageStatus) => {
    let map = new Map();

    if(sendMessageStatus.length !== 0){
        const mapStatusVerified = await verifyMessageStatus(sendMessageStatus);
        mapStatusVerified.forEach((values, keys) => {
            map.set(keys, ['', '', '', '', values[0], values[1]]);
        })
    }


    let submitTimeMap = new Map();

    keyArray.forEach(element => {
        let status = '';
        let messageTime = '';
        const rollNumber = element.rollNumber;

        if(map.has(rollNumber)){
            status = map.get(rollNumber)[4];
            messageTime = map.get(rollNumber)[5];
        }

        let shaKey = element.key;
        submitTimeMap.set(rollNumber, element.submissionTime);
        let dateString = new Date(element.submissionTime);
        const submissionDate = dateString.toLocaleDateString("en-GB", {
            timeZone: "Asia/Kolkata",
          });

          const submissionTime = dateString
          .toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          })

        map.set(rollNumber, [shaKey, submissionDate, submissionTime, '', status, messageTime])
    });

    answerPdfArray.forEach((element) => {
        let rollNumber = element.rollNumber;
        let answerPdfLink = element.answerSheet;
        let time = '';
        let shaKey = '';
        let date = '';
        let status = '';
        let messageTime = '';

        if(map.has(rollNumber)){
            shaKey = map.get(rollNumber)[0];
            date = map.get(rollNumber)[1]
            time = map.get(rollNumber)[2];
            status = map.get(rollNumber)[4];
            messageTime = map.get(rollNumber)[5];
        }

        map.set(rollNumber, [shaKey, date, time, answerPdfLink, status, messageTime]);
    });

    if(map.size === 0){
        return []
    }

    const responseData = [];

    for(const [key, values] of map.entries()){
        const answerPdfUrl = values[3];

        let isSubmittedOnTime = false;
        let sha256String = '';
        if(answerPdfUrl){
            sha256String = await generateSha256Key(answerPdfUrl);
        }

        if(values[0]){
            isSubmittedOnTime = compareTime(startTime, endTime, examDate, submitTimeMap.get(key));
        }
 
        const options = {};

        options.rollNumber = key;
        options.status = values[4];
        options.messageTime = values[5];

        // if both sha256 key and answersheet are submitted
        if(values[0] && values[3]){
            options.answerPdfLink = values[3];
            options.keySubmissionTime = values[2];
            options.keySubmissionDate = values[1];
            options.isSubmittedOnTime = isSubmittedOnTime;

            if(sha256String === values[0]){
                    options.sha256 = true;
                }

            else{
                options.sha256 = false;
            }
            responseData.push(options);
        }

        // sha256 key is submitted but not answersheet
        else if(values[0] && !values[3]){
            let options = {
                rollNumber: key,
                status: values[4],
                messageTime: values[5],
                answerPdfLink: '-',
                sha256: '_',
                keySubmissionTime: values[2],
                keySubmissionDate: values[1],
                isSubmittedOnTime,
            }
            responseData.push(options);
        }

        // sha key is not submitted but answer sheet is submitted
        else if(!values[0] && values[3]){
            let options = {
                rollNumber: key,
                status: values[4],
                messageTime: values[5],
                answerPdfLink: values[3],
                sha256: '-',
                keySubmissionTime: '-',
                keySubmissionDate: '-',
                isSubmittedOnTime: '-'
            }
            responseData.push(options);
        }

        // both sha256 key and answersheet are not submitted
        else if(!values[0] && !values[3]){
            let options = {
                rollNumber: key,
                status: values[4],
                messageTime: values[5],
                answerPdfLink: '_',
                sha256: '_',
                keySubmissionTime: '_',
                keySubmissionDate: '_',
                isSubmittedOnTime: '_',
            }
            responseData.push(options);
        }
    }

    return responseData;
}

