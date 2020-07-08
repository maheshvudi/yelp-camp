const express = require('express');
const router  = express.Router({mergeParams: true});
const Campground    = require('../models/campground');
const Comment       = require('../models/comment');
const middleware = require('../middleware');

// show new comment form
router.get("/new", middleware.isLoggedIn, (req, res)=> {
    Campground.findById(req.params.id, (err, campground)=> {
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground});
        }
    });    
});

// add comment
router.post("/", middleware.isLoggedIn, (req, res)=> {
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

// edit comment form
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=> {
    Comment.findById(req.params.comment_id, (err, comment)=> {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment});
        }
    });
})

// Update comment
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res)=> {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=> {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    
});

// Destroy comment
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=> {
    Comment.findByIdAndRemove(req.params.comment_id, (err)=> {
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;