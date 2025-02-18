
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
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const amPm = hours > 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours === 0 ? '12' : hours;
    hours = String(hours).padStart(2, "0")
    minutes = String(minutes).padStart(2, "0");

    const formattedTime = `${String(hours)}:${minutes} ${amPm}`;
    return formattedTime;
}