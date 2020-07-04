const mongoose = require('mongoose'),
    Campground = require('./models/campground'),
    Comment    = require('./models/Comment')

var data = [
    { name: "Errigal base", image: "https://images.pexels.com/photos/1840421/pexels-photo-1840421.jpeg?auto=compress&cs=tinysrgb&h=350", description: "Nice mountain foot, no toilets or drinking water" },
    { name: "Rathmullan", image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?auto=compress&cs=tinysrgb&h=350", description: "A beach with play area, pier, site for fishing and horse stable, has toilets and shops around." },
    { name: "Glenveaghue", image: "https://images.pexels.com/photos/2422265/pexels-photo-2422265.jpeg?auto=compress&cs=tinysrgb&h=350", description: "A national park with all aminities and refreshments, cycling, trecking, walking paths, castle and lakes, waterfall, botanical garden, free parking space." }
]

function seedDB() {
    //Remove all campground
    Campground.remove({}, (err) => {
        if (err) {
            console.log("Error removing campgrounds");
            console.log(err);
        } else {
            console.log("deleted all campgrounds");
            // add a few
            data.forEach((seed) => {
                Campground.create(seed, (err, campground) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create({
                            text: "This place is great",
                            author: "Bharat"
                        }, (err, comment) => {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created a comment for this campground");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;