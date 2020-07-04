const mongoose    = require('mongoose')

// SCHEMA setup
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        } 
    ]
});

// Compile schema to model
const Campground = mongoose.model("campground", campgroundSchema);

module.exports = Campground;