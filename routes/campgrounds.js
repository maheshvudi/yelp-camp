const expres = require('express')
const router = expres.Router();
const Campground    = require('../models/campground');
const campground = require('../models/campground');

// middleware checks user login
const  isLoggedIn = (req, res, next)=> {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

const checkCampgroundOwnership = (req, res, next)=> {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground)=> {
            if(err) {
                console.log(err)
                res.redirect("/campgrounds");
            } else {
                // does user own the campground
                // since the record found is a objectid vs user info is a string use equals method from mongoose
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });    
    } else {
        // take user back to where the came from
        res.redirect("back");
    }
}

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
router.post("/", isLoggedIn, (req, res)=> {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let author = {id: req.user._id, username: req.user.username};
    let newCampground = {name, image, description, author};
    Campground.create(newCampground, (err, camp)=> {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });    
});

// NEW - show form to create new campground
router.get("/new", isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW - show details of a campground
router.get("/:id", (req, res)=> {
    console.log(req.params.id);
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground)=> {
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });    
});

// EDIT - campground
router.get("/:id/edit", checkCampgroundOwnership, (req, res)=> {
    Campground.findById(req.params.id, (err, foundCampground)=> {
        if(err) {
            console.log(err)
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });    
});

// UPDATE - campground
router.put("/:id", checkCampgroundOwnership, (req, res)=> {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=> {
        if(err) {
            console.log(err)
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - campground
router.delete("/:id", checkCampgroundOwnership, (req, res)=> {
    Campground.findByIdAndRemove(req.params.id, (err)=> {
        if(err) {
            console.log(err)
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
})

module.exports = router;