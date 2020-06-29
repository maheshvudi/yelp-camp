const mongoose    = require('mongoose')

// SCHEMA setup
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

// Compile schema to model
const Campground = mongoose.model("campground", campgroundSchema);

module.exports = Campground