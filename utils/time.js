const addOneHour = () => {
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 1);
  return currentDate;
};

module.exports = {
  addOneHour,
};
