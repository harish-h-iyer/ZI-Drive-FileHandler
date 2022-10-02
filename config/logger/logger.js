const { createLogger, transports } = require('winston');
const winston = require('winston');
const morganBody = require('morgan-body');

const app = require("../../index");
const dailyRotate = require("./dailyRotateConfig/dailyRotate");



let alignColorsAndTime = winston.format.combine(
    winston.format.colorize({
        all: true
    }),
    winston.format.timestamp({
        format: "DD-MM-YYYY HH:mm:ss:SSS"
    }),
    winston.format.printf(
        info => ` ${info.timestamp}  ${info.level} : ${info.message}`
    )
);
 
var logger = new winston.createLogger({
    transports: [
        //TO STORE LOGS IN FILE
        dailyRotate,
        //TRANSPORTER FOR ERROR
        //TO SHOW LOGS IN CONSOLE
        new winston.transports.Console({
            level: 'error',
            handleExceptions: true,
            format: winston.format.combine(winston.format.colorize(), alignColorsAndTime),
            json: false,
            colorize: true
        }),
        //DEBUG_LOG_TRANSPORT
        //FOR LOG TO CONSOLE
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            format: winston.format.combine(winston.format.colorize(), alignColorsAndTime),
            json: false,
            colorize: true
        }), 
    ],
    exitOnError: false
});


//MORGAN CONFIGURATION
const loggerStream = {
    write: message => {
        logger.info(message);
    },
};

morganBody(app, {
    // .. other settings
    // handleExceptions:true,
    stream: loggerStream,
    prettify: false,
    noColors: true,
    maxBodyLength: 1000000000000000000000000000000000,
    filterParameters: ["password"]
    //skip: (req, res) => { return req.originalUrl.startsWith('/dis/studio-docs') }
});

module.exports = logger;


