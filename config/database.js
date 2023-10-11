/* eslint-disable consistent-return */
const mongoose = require("mongoose");

const connect = async () => {
  try {
    const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.fx2rtz1.mongodb.net/hiking`;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    process.exit(1);
  }
};

module.exports = connect;
