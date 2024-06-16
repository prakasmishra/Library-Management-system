export const addDaysToDate = (dateString, days) => {
    // Check if date string is valid (using a regular expression)
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (!regex.test(dateString)) {
      throw new Error("Invalid date format. Please provide a date in 'dd-mm-yyyy' format.");
    }
  
    // Parse the date string into a Date object
    const dateParts = dateString.split('-');
    const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // Month is 0-indexed
  
    // Add the specified number of days
    date.setDate(date.getDate() + days);
  
    // Format the new date in the desired format
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  }