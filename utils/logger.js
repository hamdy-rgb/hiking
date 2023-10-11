const { setLogLevel } = require("@azure/logger");

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  setLogLevel("info");
  next();
};

module.exports = logger;
