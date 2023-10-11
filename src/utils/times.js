const formatToYYYYMMDD = timestamp => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatToLocalizedBirthday = dateString => {
  const [year, month, day] = dateString.split("-");
  const monthNames = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];
  const monthName = monthNames[Number(month) - 1];

  return `${day} ${monthName} ${year}`;
};

const formatToISODate = dateString => {
  return formatToLocalizedBirthday(formatToYYYYMMDD(dateString));
};

const getTimeFromDate = dateString => {
  const date = new Date(dateString);
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return time;
};

const formatDateTime = dateTimeString => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const date = new Date(dateTimeString);
  const formattedDate = date.toLocaleString("fr-CA", options);

  return formattedDate;
};

export {
  formatToYYYYMMDD,
  formatToLocalizedBirthday,
  formatToISODate,
  getTimeFromDate,
  formatDateTime,
};
