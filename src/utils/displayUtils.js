export const printDayCount = (dayCount) => {
const suffix = (dayCount > 1)? "days": "day";
return `${dayCount} ${suffix}`; 
}