const mongoose    = require('mongoose')

// SCHEMA setup
const commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        username: String
    }
});

// Compile schema to model
module.exports =  mongoose.model("comment", commentSchema);
