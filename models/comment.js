const mongoose    = require('mongoose')

// SCHEMA setup
const commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

// Compile schema to model
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;