// all middleware goes here
const   Comment     = require('../models/comment'),
        Campground  = require('../models/campground')

const middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next)=> {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = (req, res, next)=> {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground)=> {
            if(err || !foundCampground) {
                console.log(err)
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            } else {
                // does user own the campground
                // since the record found is a objectid vs user info is a string use equals method from mongoose
                if(foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });    
    } else {
        // take user back to where the came from
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next)=> {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment)=> {
            if(err || !foundComment) {
                console.log(err)
                req.flash("error", "Something went wrong, not able to get the comment");
                res.redirect("back");
            } else {
                // does user own the comment
                // since the record found is a objectid vs user info is a string use equals method from mongoose
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });    
    } else {
        // take user back to where the came from
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = middlewareObj