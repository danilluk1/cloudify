const winston = require("winston");
const { format, transports, timestamp } = require("winston");

const logFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level} ${message}`;
});
const logger = winston.createLogger({
  level: "debug",
  format: format.combine(format.timestamp(), logFormat),
  transports: [new winston.transports.Console()],
});

module.exports = logger;
