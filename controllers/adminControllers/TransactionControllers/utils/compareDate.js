function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day); // Month is zero-based in JavaScript Date
  }
  
export function compareDates(dateStr1, dateStr2) {
    const date1 = parseDate(dateStr1);
    const date2 = parseDate(dateStr2);
  
    if (date1 < date2) {
      return -1; // dateStr1 is earlier than dateStr2
    } else if (date1 > date2) {
      return 1; // dateStr1 is later than dateStr2
    } else {
      return 0; // dateStr1 is the same as dateStr2
    }
  }
  