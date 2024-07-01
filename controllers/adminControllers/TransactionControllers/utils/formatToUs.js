
export function formatDateToYYYYMMDD(dateString) {
  // Split the input string by the hyphen
  let parts = dateString.split('-');
    
  // Rearrange the parts to match "yyyy-mm-dd" format
  let formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  
  return formattedDate;
}
