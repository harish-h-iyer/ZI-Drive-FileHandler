const express = require("express");
const router = express.Router();
const middleWare = require("../middleware/middleware");
const FileHandlerService = require("../services/BLogic/FileHandlerService");
const commonUtils = require("../utils/CommonUtils");
const multer = require("multer");
const fse = require("fs-extra");
const path = require("path");
const config = require("config");
const logger = require("../config/logger/logger");

router.get("/getFilesAndFolderList", middleWare,FileHandlerService.getFilesAndFolderList);

module.exports = router;