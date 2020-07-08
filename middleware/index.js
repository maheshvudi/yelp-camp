// all middleware goes here
const   Comment     = require('../models/comment'),
        Campground  = require('../models/campground')

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next)=> {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = (req, res, next)=> {
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

middlewareObj.checkCommentOwnership = (req, res, next)=> {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment)=> {
            if(err) {
                console.log(err)
                res.redirect("back");
            } else {
                // does user own the comment
                // since the record found is a objectid vs user info is a string use equals method from mongoose
                if(foundComment.author.id.equals(req.user._id)) {
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

module.exports = middlewareObj