const expres = require('express')
const router = expres.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware');

// INDEX - show all campgrounds
router.get("/", (req, res)=> {
    Campground.find({}, (err, allCampgrounds)=> {
        if(err) {
            console.log("Error fetching campgrounds");
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds} );
        }        
    });
});

// CREATE - add a new campground
router.post("/", middleware.isLoggedIn, (req, res)=> {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {id: req.user._id, username: req.user.username};
    let newCampground = {name, image, description, author};
    Campground.create(newCampground, (err, camp)=> {
        if(err) {
            req.flash("error", "Unable to create Campground");
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });    
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW - show details of a campground
router.get("/:id", (req, res)=> {
    console.log(req.params.id);
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground)=> {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            console.log(err);
            res.redirect("back");
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });    
});

// EDIT - campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=> {
    Campground.findById(req.params.id, (err, foundCampground)=> {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            console.log(err)
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });    
});

// UPDATE - campground
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=> {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=> {
        if(err || !updatedCampground) {
            req.flash("error", "Not able to update Campground");
            console.log(err)
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - campground
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=> {
    Campground.findById(req.params.id, (err, foundCampground)=> {
        if(err || !foundCampground) {
            req.flash("error", "Campground not found");
            console.log(err)
            res.redirect("/campgrounds");
        } else {
            // get the comment ids for this campground
            const ids = [];
            foundCampground.comments.forEach(comment => {
                ids.push(comment._id);
            });
            console.log("total comments to be deleted "+ ids.length);
            // delete all the comments
            Comment.deleteMany({
                _id: {$in: ids}
            }).then( ()=> {
                console.log("comments delted")
            }).catch( (err)=> {
                req.flash("error", "An error occurred while removing comments of the campground.");
                console.log(err);
            });
            // delete the campground
            foundCampground.remove().then( ()=> {
                console.log("campground delted")
            }).catch( (err)=> {
                req.flash("error", "An error occurred while removing the campground.");
                console.log(err);
            });
            req.flash("success", "Campground removed");
            res.redirect("/campgrounds");
        }
    });
})

module.exports = router;