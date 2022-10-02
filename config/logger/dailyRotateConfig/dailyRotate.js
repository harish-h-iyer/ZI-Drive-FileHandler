const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

let align = winston.format.combine(
    winston.format.timestamp({
        format: "DD-MM-YYYY HH:mm:ss:SSS"
    }),
    winston.format.printf(
        info => `${info.timestamp}  ${info.level} : ${info.message}`
    )
);

const dailyRotate = new DailyRotateFile({
    filename: "./fileHandler.log",
    datePattern: 'DD-MM-YYYY',
    dirname: "./logs",
    zippedArchive: true,
    maxSize: '50m',
    maxFiles: '1d',
    prepend: true,
    level: "debug",
    format: winston.format.combine(
        align,
    )
});


module.exports = dailyRotate;