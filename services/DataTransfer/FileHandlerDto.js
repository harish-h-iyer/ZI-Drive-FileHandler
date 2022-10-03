exports.generateUserObject = function(data) {
    return {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        gender: data.gender
    }
}

exports.generateTokenObject = function(data, token) {
    return {
        email: data.email,
        token: token,
        created_at: new Date()
    }
}

exports.savefileObject = function(owner, filePath, fileName) {
    return {
        owner: owner,
        fileName: fileName,
        filePath: filePath,
        access: [owner],
        created_at: new Date()
    }
}

exports.generateContentObject = function(data) {
    var result = [];

    data.forEach(obj => {
        if(obj.folderName){
            var resultObj = {
                nameOfFolderOrFile: obj.folderName,
                owner: obj.owner,
                description: obj.description,
                type: "Folder"
            }
        }else{
            var resultObj = {
                nameOfFolderOrFile: obj.fileName,
                owner: obj.owner,
                description: "",
                type: "File"
            }
        }

        result.push(resultObj);
    })
    return result;
}