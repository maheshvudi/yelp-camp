const mongoose    = require('mongoose')

// SCHEMA setup
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comment" // refferts to the model that we refer with this ObjectId
        } 
    ]
});

// Compile schema to model
module.exports = mongoose.model("campground", campgroundSchema);
