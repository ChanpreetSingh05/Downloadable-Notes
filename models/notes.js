const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
    title: {type: String,  required: true, min: 3},
    description: {
        type: String,  default : ""
    }
});

module.exports = mongoose.model("Notes",NotesSchema);