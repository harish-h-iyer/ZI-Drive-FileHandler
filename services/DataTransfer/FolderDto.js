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