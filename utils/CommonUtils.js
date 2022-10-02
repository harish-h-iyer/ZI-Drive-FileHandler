//To Check Empty Field 
exports.checkEmptyFieldValue = function (fieldValue) {
    var flag;
    if (fieldValue == undefined || fieldValue == null || fieldValue == "") {
        flag = false;
    } else {
        flag = true;
    }
    return flag;
}
