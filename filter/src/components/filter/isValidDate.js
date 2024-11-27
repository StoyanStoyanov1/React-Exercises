function isValidDate(dateStr) {
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
    const usDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  
    return isoDateRegex.test(dateStr) || usDateRegex.test(dateStr);
  }

export default isValidDate;