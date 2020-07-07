const express = require('express');
const router  = express.Router({mergeParams: true});
const Campground    = require('../models/campground');
const Comment       = require('../models/comment');

// middleware checks user login
const  isLoggedIn = (req, res, next)=> {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// show new comment form
router.get("/new", isLoggedIn, (req, res)=> {
    Campground.findById(req.params.id, (err, campground)=> {
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground});
        }
    });    
});

// add comment
router.post("/", isLoggedIn, (req, res)=> {
    Campground.findById(req.params.id, (err, campground)=> {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment)=> {
                if(err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    res.redirect("/campgrounds/"+ campground._id);
                }
            });    
        }
    });    

});

module.exports = router;