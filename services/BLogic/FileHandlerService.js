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

exports.moveFiles = function(req, res){
    var old_path =req.body.oldPath;
    var new_path = req.body.newPath;

    var email =req.user.email;

    var directoryPath = config.get("FOLDER_DIRECTORY");

    var src = "/" + email + old_path;
    var dst = "/" + email + new_path;

    old_path = directoryPath + "/" + email + old_path; 
    new_path = directoryPath + "/" + email + new_path; 

    fse.move(old_path, new_path, err => {
        if (err) return console.error(err)
        console.log('success!')
      })

    var query = {
        "folderPath": src,
        "owner": email
    }

    FolderModel.updateMany(query, {folderPath: dst}, function(error, response){
        if(error){
            return res.status(500).json({
                message: "Internal Server Error"
            });
        }else{
            var fileQuery = {
                "filePath": src,
                "owner": email
            }
        
            fileModel.updateMany(fileQuery, {filePath: dst}, function(error, response){
                if(error){
                    return res.status(500).json({
                        message: "Internal Server Error"
                    });
                }else{
                    return res.status(200).json({
                        message: "File Moved Successfully"
                    });
                }
            })
        }
        console.log(response);
    })
}

exports.changePermission = function(req, res){
    var path = req.body.path;
    var type = req.body.type;
    var folderOrFileName = req.body.folderOrFileName;
    var email = req.user.email;
    var access = req.body.access;

    path  = "/" + email + path ;

    if(type == "File"){
        var query = {
            filePath: path,
            fileName: folderOrFileName,
            owner: email
        }

        fileModel.findOneAndUpdate(query, {access: access}, function(error, response){
            console.log(response)
        })
    }else{

        var folderPath = path + folderOrFileName + "/";

        var query = {
            $or: [
                { folderPath: path, folderPath: folderPath },
            ],
            owner: email
        }
        console.log(path)

        FolderModel.updateMany(query, {access: access}, function(error, response){
            if(error){
                return res.status(500).json({
                    message: "Internal Server Error"
                });
            }else{
                var query = {
                    owner: email,
                    filePath: path
                }

                fileModel.updateMany(query, {access: access}, function(error, responseFounde) {
                    if(error){
                        
                    }else{
                        return res.status(200).json({
                            message: "Permission Changed"
                        })
                    }
                })
            }
        })
    }

}