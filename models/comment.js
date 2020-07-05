const mongoose    = require('mongoose')

// SCHEMA setup
const commentSchema = mongoose.Schema({
    text: String,
    author: String
});

// Compile schema to model
module.exports =  mongoose.model("comment", commentSchema);
