const mongoose = require("mongoose");
const config = require("config");
const process = require("process");
const DB_HOST = config.get('DB_HOST');
const DB_PORT = config.get('DB_PORT');
const DB_NAME = config.get('DB_NAME');
const DB_USERNAME = config.get('DB_USERNAME');
const DB_PASS = config.get('DB_PASS');

const logger = require("../logger/logger");

//const DB_Connection = "mongodb://" + DB_USERNAME + ":" + DB_PASS + "@" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME;
const DB_Connection = "mongodb://" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME;

logger.info(`DB_Connection ${DB_HOST}`);

const mongoose_options = {
  useNewUrlParser: true,
  autoIndex: false, // recommende to be disabled for production 
  useUnifiedTopology: true, // new connection management engine for maintaining a stable connection
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  authSource: "admin" // The database to use when authenticating with user and pass
}

const connectDB = async () => {
  try {
    const clientDB = await mongoose.connect(DB_Connection, mongoose_options);
    //console.log(`MongoDB connected: ${clientDB.connection.host}`);


  } catch (error) {
    console.error(error);
    logger.error("Database is down. Please start the NoSQL_DB Server")
    process.exit(1);
  }
};

/*  mongoose.connect(DB_Connection, mongoose_options).catch(error => {
   console.log("Database is down. Please start the NoSQL_DB Server")
   
 }); */
mongoose.connection.on('connected', function () {
  logger.info(`Database connection open to ${mongoose.connection.host} ${mongoose.connection.name}`);
});
mongoose.connection.on('error', function (err) {
  logger.error('Mongoose default connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
  logger.warn('Mongoose default connection disconnected');
});
mongoose.connection.on('close', function () {
  logger.info('Mongoose default connection closed');
});

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    logger.info("Mongoose default connection is disconnected due to application termination");
    process.exit(0)
  });
});

//exports.connectDB = connectDB;
module.exports = connectDB;
