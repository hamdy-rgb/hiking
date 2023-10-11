const { createLogger, format, transports } = require("winston");
const appInsights = require("applicationinsights");
const {
  AzureApplicationInsightsLogger,
} = require("winston-azure-application-insights");
const fs = require("fs");
const path = require("path");

// Initialize Application Insights
appInsights.setup(process.env.INSTRUMENTATION_KEY).start();

// Create a log directory if it doesn't exist
const logDirectory = path.join(__dirname, "../logs");
// eslint-disable-next-line no-unused-expressions
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Use an existing app insights SDK instance
const azureAppInsightsLogger = new AzureApplicationInsightsLogger({
  insights: appInsights,
});

// Configure Winston to log errors to a file with log rotation
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  defaultMeta: { service: process.env.SERVICE_NAME },
  transports: [
    // Log errors to Azure Application Insights
    azureAppInsightsLogger,

    // Log errors to a file with log rotation
    new transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, // 5MB max file size
      maxFiles: 5, // 5 log files in rotation
      tailable: true, // Allow tailing of the log file
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

module.exports = { logger };
