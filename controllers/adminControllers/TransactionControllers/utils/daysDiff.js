export function subtractDates(date1, date2) {
  // Helper function to parse 'dd-mm-yyyy' format to a Date object
  function parseDate(dateStr) {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
  }

  const firstDate = parseDate(date1);
  const secondDate = parseDate(date2);

  // Calculate the time difference in milliseconds
  const timeDiff = Math.abs(secondDate - firstDate);

  // Convert time difference from milliseconds to days
  const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  return dayDiff;
}