var FolderModel = require("../../models/FolderModel");
var config = require("config");
const folderDto =  require("../DataTransfer/FolderDto");
const fse = require("fs-extra");
const { response } = require("../../routes/routersManagement");

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
            return res.status(200).json({
                payload: foundFolders,
                message: "Success"
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