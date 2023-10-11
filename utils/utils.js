const generateUniqueNumber = () => {
  const currentDateTime = new Date();
  const year = currentDateTime.getFullYear();
  const month = currentDateTime.getMonth() + 1; // Months are zero-based
  const day = currentDateTime.getDate();
  const hours = currentDateTime.getHours();
  const minutes = currentDateTime.getMinutes();
  const seconds = currentDateTime.getSeconds();
  const milliseconds = currentDateTime.getMilliseconds();

  // Concatenate the values and parse them into an integer
  const uniqueNumber = parseInt(
    `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`,
    10,
  );

  return uniqueNumber;
};

module.exports = { generateUniqueNumber };
