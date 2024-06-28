export function modifyLibCardString(libCardString, lib_card_no,value) {
    const index = lib_card_no - 1; // Adjust index for zero-based indexing
  
    // Error handling (optional)
    if (index < 0 || index >= libCardString.length) {
      throw new Error("Invalid library card number or string index");
    }
  
    const partBefore = libCardString.substring(0, index);
    const partAfter = libCardString.substring(index + 1);
    const modifiedString = partBefore + value + partAfter;
  
    return modifiedString;
}