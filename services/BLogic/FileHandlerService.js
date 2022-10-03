var FolderModel = require("../../models/FolderModel");
var config = require("config");
const folderDto =  require("../DataTransfer/FolderDto");
const fse = require("fs-extra");
const { response } = require("../../routes/routersManagement");
const fileHandlerDto = require("../DataTransfer/FileHandlerDto");
const fileModel = require("../../models/FileModel");

exports.getFilesAndFolderList = function(req, res){
    var folderPath = req.query.folderPath;
    var email = req.user.email;

    folderPath  = "/" + email + folderPath ;
    var query = {
        folderPath: folderPath,
        owner: email
    };

    FolderModel.find(query, function(error, foundFolders){
        if(error){
            return res.status(404).json({
                message: "No Content in given path"
            })
        }else{

            var folderResult = fileHandlerDto.generateContentObject(foundFolders);
            var queryForFile = {
                filePath: folderPath,
                owner: email
            }
            fileModel.find(queryForFile, function(error, foundFiles){
                if(error){

                }else{
                    var fileResult = fileHandlerDto.generateContentObject(foundFiles);


                    var result = folderResult.concat(fileResult);
                    
                    return res.status(200).json({
                        payload: result,
                        message: "Success"
                    })
                }
            })
        }   
    });
}

exports.createFolder = function(req, res){
    var folderPath = req.body.folderPath;

    var email = req.user.email;

    var folderName = req.body.folderName;

    var directoryPath = config.get("FOLDER_DIRECTORY");

    var newFolderPath = "/" + email + folderPath ;

    folderPath  = "/" + email + folderPath + folderName;

    directoryPath = directoryPath + folderPath;
    
    console.log(directoryPath);

    fse.ensureDirSync(directoryPath, (error, result) => {
        // => null
       if(error){
           console.log(error.stack);
       }

       // dir has now been created, including the directory it is to be placed in
   })
   var folderObj = new FolderModel(folderDto.savefolderObject(email, newFolderPath, folderName, req));


    console.log(folderObj);
    folderObj.save(folderObj, function(error, result){
        if(error){
            var message = {
                message: error
            }
            return res.status(500).json(message);
        }else{
            var message = {
                message: "Folder Created Successfully"
            }
            return res.status(200).json(message);      
        }
    })
}

exports.uploadFile = function(req, res){
    var filePath = req.filePath;
    var filesObj = req.files;
    var arrayOfFileObj = [];
    var email =req.user.email;

    filesObj.forEach(file => {
        var fileObj = fileHandlerDto.savefileObject(email, filePath, file.filename)
        
        var filesObject = new fileModel(fileObj);

        filesObject.save(filesObject, function(error, result){
            if(error){
                return res.status(500).json({
                    message: "Internal Server Error"
                })
            }
        })
    })

    return res.status(200).json({
        message: "Files Uploaded Successfully"
    })

}