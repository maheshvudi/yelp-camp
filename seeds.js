const   mongoose = require('mongoose'),
        Comment    = require('./models/comment'),
        Campground = require('./models/campground')

var data = [
    { name: "Errigal peack", image: "https://pixabay.com/get/55e8dc404f5aab14f1dc84609620367d1c3ed9e04e507440762679d6934cc1_340.jpg", description: "Nice mountain, no toilets or drinking water, to reach the top you need to treck for nearly 3 hours. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum nulla porro dignissimos necessitatibus, sunt consequuntur debitis tempora similique sit magnam accusantium neque accusamus nesciunt in ut ea deserunt voluptatem illo suscipit, expedita rem numquam eum rerum. Officiis cumque itaque est recusandae ipsa animi non explicabo fugiat repellat enim, obcaecati necessitatibus." },
    { name: "Rathmullan", image: "https://images.pexels.com/photos/6757/feet-morning-adventure-camping.jpg?auto=compress&cs=tinysrgb&h=350", description: "A beach with play area, pier, site for fishing and horse stable, has toilets and shops around. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum nulla porro dignissimos necessitatibus, sunt consequuntur debitis tempora similique sit magnam accusantium neque accusamus nesciunt in ut ea deserunt voluptatem illo suscipit, expedita rem numquam eum rerum. Officiis cumque itaque est recusandae ipsa animi non explicabo fugiat repellat enim, obcaecati necessitatibus." },
    { name: "Glenveaghue", image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&h=350", description: "A national park with all aminities and refreshments, cycling, trecking, walking paths, castle and lakes, waterfall, botanical garden, free parking space. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum nulla porro dignissimos necessitatibus, sunt consequuntur debitis tempora similique sit magnam accusantium neque accusamus nesciunt in ut ea deserunt voluptatem illo suscipit, expedita rem numquam eum rerum. Officiis cumque itaque est recusandae ipsa animi non explicabo fugiat repellat enim, obcaecati necessitatibus." }
]

function seedDB() {
    //Remove all campground
    Campground.deleteMany({}, (err) => {
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