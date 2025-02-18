
export const getExamDate = (testDate) => {
    const date = new Date(testDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}

export const getExamTime = (examTime) => {
    const date = new Date(examTime);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    const amPm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; 
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");

    const formattedTime = `${hours}:${minutes} ${amPm}`;
    return formattedTime;

}

export const convertISTtoUTC = (date, time) => {
    const [timePart, amPm] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (amPm === 'PM' && hours !== 12) hours += 12;
    if (amPm === 'AM' && hours === 12) hours = 0;

    const istDateTime = new Date(`${date}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+05:30`);
    
    return istDateTime.toISOString();
}

export const convertDateToIST = (date) => {
    return date.toLocaleDateString('en-GB', { timeZone: 'Asia/Kolkata' });
}

export const convertTimeToIST = (time) => {
    return time.toLocaleTimeString('en-IN', { 
        timeZone: 'Asia/Kolkata', 
        hour: '2-digit', 
        minute: '2-digit', 
        hourCycle: 'h12'
    });
}