const expres = require('express')
const router = expres.Router();
const Campground    = require('../models/campground')

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
router.post("/", (req, res)=> {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCampground = {name, image, description};
    Campground.create(newCampground, (err, camp)=> {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });    
});

// NEW - show form to create new campground
router.get("/new", (req, res) => {
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

module.exports = router;