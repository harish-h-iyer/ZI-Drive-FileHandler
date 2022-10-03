const express = require('express');
const apps = module.exports = express();

const fileRoute = require('./FileManagementRoute');
// const mobileRoute = require('./MobileRoute');
// const EndUserRoute = require("./EndUserRoute");
// const ReportsRoute = require("./ReportsRoute");

apps.use('/fileHandler', fileRoute);
// apps.use('/dashboard', mobileRoute);
// apps.use('/endUser', EndUserRoute);
// apps.use('/reports', ReportsRoute);