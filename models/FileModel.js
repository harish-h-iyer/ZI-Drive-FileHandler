const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    owner: {
        type: String
    },
    fileName : {
        type: String,
        required: true
    },
    filePath : {
        type: String
    },
    access : {
        type: String
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
});

module.exports = mongoose.model("files", fileSchema, "files");