exports.savefolderObject = function(owner, folderPath, folderName, req) {
    return {
        owner: owner,
        folderName: folderName,
        isRoot: false,
        description: req.body.description,
        folderPath: folderPath,
        access: owner,
        created_at: new Date()
    }
}

exports.updatedfolderObject = function(foundFolder, folderPath) {
    
    foundFolder.folderPath = folderPath;
    foundFolder.update_at = new Date();

    return foundFolder;
}