import * as workingHours from '../constants/workingHours';
import moment from 'moment-business-days';

const calculateTimeAddition = (timeDiff) => {      
    if (timeDiff <= 2.5 * workingHours.ONE_HOUR) {
        return workingHours.NO_ADDITION;
    } else if (timeDiff <= 4 * workingHours.ONE_HOUR) {
        return workingHours.HALF_DAY;
    } else {    
        return workingHours.FULL_DAY;
    }         
} 

export const calculateLeaveDuration = (dayDiff,timeDiff,isStartTimeAfter) => {  
    let additionDate = calculateTimeAddition(timeDiff);
    if (isStartTimeAfter) {
        additionDate = additionDate - 1;
    }
    return dayDiff + additionDate;
}    

export const getTimeDifference = (startTime,endTime,dayDiff) => {
    // Does not affect to calculation directly. Just used to craft a date object
    const dateFormat = "DD/MM/YYYY HH:mm:ss";   
    const startDate = moment(`${workingHours.SPARE_DATE} ${startTime}`,dateFormat);
    const endDate = moment(`${workingHours.SPARE_DATE} ${endTime}`,dateFormat);
    const breakDate = moment(`${workingHours.SPARE_DATE} ${workingHours.BREAK_TIME}`,dateFormat);    
    const leaveBoundaryDate = moment(`${workingHours.SPARE_DATE} ${workingHours.LEAVE_BOUNDARY}`,dateFormat); 
    const middayBoundaryDate = moment(`${workingHours.SPARE_DATE} ${workingHours.MIDDAY_BOUNDARY}`,dateFormat);     
    const workStart = moment(`${workingHours.SPARE_DATE} ${workingHours.WORK_START_TIME}`,dateFormat);
    const workEnd = moment(`${workingHours.SPARE_DATE} ${workingHours.WORK_END_TIME}`,dateFormat);

    let timeDiff;    
    let isStartTimeAfter = false;   
    if (dayDiff === 0 || startDate.isBefore(endDate)) {
        timeDiff = endDate.diff(startDate,"minutes");
    }

    else {
        let firstDayLeave = workEnd.diff(startDate,"minutes");    
        if (startDate.isBetween(middayBoundaryDate,leaveBoundaryDate)) {
            firstDayLeave = 180;
        }
        const lastDayLeave = endDate.diff(workStart,"minutes");
        timeDiff = firstDayLeave + lastDayLeave;                 
        isStartTimeAfter = true;           
    }

    // If the times contains break time, exclude from calculation
    if (breakDate.isBetween(startDate,endDate)) {
        timeDiff = timeDiff - workingHours.ONE_HOUR;
    }   

    return [timeDiff,isStartTimeAfter];
}