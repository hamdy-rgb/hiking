process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception: ", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

require("dotenv").config();
const compression = require("compression");
const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const connect = require("./config/database");

const app = express();
const port = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.use(compression());
} else {
  console.log("Running in development mode.");
}

app.use(cors());
app.use(logger);

// Routes
const authRouter = require("./routes/auth");
const defaultRouter = require("./routes/index");
const userRouter = require("./routes/users");
const categoryRouter = require("./routes/category");

// Middleware
app.use(express.json());
app.use(logger);

connect()
  .then(() => {
    // Routes
    app.use("/api/auth", authRouter);
    app.use("/api/", defaultRouter);
    app.use("/api/", userRouter);
    app.use("/api/", categoryRouter);

    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
    process.exit(1);
  });
