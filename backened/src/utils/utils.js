
export const makeId = (length) => {
    let result = '';

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
}

export const compareTime = (startTime, endTime, examDate, ShaKeyTime) => {
    const startDateTime = new Date(`${examDate.toISOString().split("T")[0]}T${startTime.toISOString().split("T")[1]}`);
    const endDateTime = new Date(`${examDate.toISOString().split("T")[0]}T${endTime.toISOString().split("T")[1]}`);
    const shaKey = new Date(ShaKeyTime);

    return shaKey >= startDateTime && shaKey <= endDateTime;

}

export const getTwilioSMSDetails = (str) => {
    const strArr = str.split("%");
    const info = {
        key: strArr[0],
        testId: strArr[1],
        rollNumber: strArr[2]
    }
    return info;
}