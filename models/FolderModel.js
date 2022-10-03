const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
    owner: {
        type: String
    },
    folderName : {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    folderPath : {
        type: String
    },
    isRoot : {
        type: Boolean,
        default: false
    },
    access : [{
        type: String
    }],
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
});

module.exports = mongoose.model("folders", folderSchema, "folders");