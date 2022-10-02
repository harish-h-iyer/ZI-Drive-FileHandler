const express = require("express");
const app = (module.exports = express());
const bodyParser = require("body-parser");
const config = require("config");
const PORT = config.get("PORT");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const SERVER_IP = config.get("SERVER_IP");
const ENABLE_DOC = config.get("ENABLE_DOC");

//LIMIT CONFIGURATION
app.use(bodyParser.json({
  limit: '50mb',
  extended: true
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));


const routersManagement = require("./routes/routersManagement");
const logger = require("./config/logger/logger");
const connectDB = require("./config/database/db_config");
connectDB();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use(express.json());
app.use(routersManagement);

//Swagger options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ZI-Drive",
      version: "2.0.0",
      description: `ZI-Drive is Storage Solution for customer`
    },
    explorer: true,
    "components": {
      "securitySchemes": {
        "bearerAuth": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT"
        }
      }
    },
    "security": [
      {
        "bearerAuth": []
      }
    ],
    servers: [
      {
        url: `http://${SERVER_IP}:5002`,
        description: 'ZI-Drive Server(http)'
      },
      {
        url: `https://${SERVER_IP}:5008/`,
        description: 'Gateway-ZI Server(https)'
      }
    ],
  },
  apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options);


app.all("*", (req, res, next) => {
  const err = new Error(
    `Can't find ${req.method} ${req.originalUrl} on this server!`
  );
  err.status = "fail";
  err.statusCode = 404;
  logger.error(err);
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";


  if (err.message.includes("ENOENT: no such file or directory")){
    res.status(200).json({
      status: err.status,
      message: "No such File or Directory Found",
      messageKey: "FILE.NOT.FOUND",
      success: false
    });
  }else{
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
 

  logger.error(err);
});


app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
