
export const makeId = (length) => {
    let result = '';

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

export const compareTime = (startTime, endTime, examDate, ShaKeyTime) => {
    const shaKey = new Date(ShaKeyTime);

    const startDateTime = new Date(examDate);
    startDateTime.setUTCHours(startTime.getUTCHours(), startTime.getUTCMinutes(), startTime.getUTCSeconds());

    const endDateTime = new Date(examDate);
    endDateTime.setUTCHours(endTime.getUTCHours(), endTime.getUTCMinutes(), endTime.getUTCSeconds());

    return shaKey >= startDateTime && shaKey <= endDateTime;
};


export const getTwilioSMSDetails = (str) => {
    const strArr = str.split("%");
    const info = {
        key: strArr[0],
        testId: strArr[1],
        rollNumber: strArr[2]
    }
    return info;
}