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

const storage = multer.diskStorage({
    destination: (req, file,cb) => {
        //cb(null, 'E:\\FileUploads');
        var folderPath = req.headers.folderpath;
        console.log(req);
        var email = req.user.email;

        var directoryPath = config.get("FOLDER_DIRECTORY")

        directoryPath = directoryPath + email + folderPath;

        req.filePath = "/" + email + folderPath;

        cb(null, directoryPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);    
    }
});

const upload = multer({
    storage: storage
});

router.get("/getFilesAndFolderList", middleWare,FileHandlerService.getFilesAndFolderList);

router.post("/createFolder", middleWare,FileHandlerService.createFolder);

router.post("/uploadFile",middleWare,upload.array('files'),FileHandlerService.uploadFile);

router.post("/moveFiles",middleWare,FileHandlerService.moveFiles);

router.post("/changePermission",middleWare,FileHandlerService.changePermission);


module.exports = router;