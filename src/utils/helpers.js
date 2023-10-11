const formatPhoneNumber = phoneNumber => {
  // Extract the internal code from the phone number
  const internalCode = phoneNumber.slice(0, 4);
  // Extract the actual phone number digits
  const digits = phoneNumber.slice(4);
  // Format the phone number with the internal code in parentheses
  const formattedNumber = `(${internalCode}) ${digits}`;
  // Return the formatted phone number
  return formattedNumber;
};

const getTimeOfDayInFrench = timeOfDay => {
  switch (timeOfDay) {
    case "day":
      return "jour";
    case "evening":
      return "soir";
    case "night":
      return "nuit";
    default:
      return "--";
  }
};

const formatCanadianPhoneNumber = number => {
  let cleanedNumber = number.replace(/\D/g, "");

  const countryCode = "+1";
  let areaCode;
  let firstPart;
  let secondPart;

  if (cleanedNumber.length === 11 && cleanedNumber.startsWith("1")) {
    cleanedNumber = cleanedNumber.slice(1);
  }

  if (cleanedNumber.length === 10) {
    areaCode = cleanedNumber.slice(0, 3);
    firstPart = cleanedNumber.slice(3, 6);
    secondPart = cleanedNumber.slice(6);
  } else {
    return "Invalid phone number";
  }

  return `(${countryCode}) ${areaCode} ${firstPart} ${secondPart}`;
};

const extractSubdomain = url => {
  const cleanedUrl = url.replace(/^(https?:\/\/)?(www\.)?/, "");
  const parts = cleanedUrl.split(".");
  if (parts.length >= 2) {
    return parts[0];
  }

  return cleanedUrl;
};

export {
  formatPhoneNumber,
  getTimeOfDayInFrench,
  formatCanadianPhoneNumber,
  extractSubdomain,
};
