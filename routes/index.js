const express   = require('express')
const router    = express.Router();
const passport  = require('passport')
const User      = require('../models/user')

// INDEX 
router.get('/', (req, res)=> {
    res.render('landing');
});

// AUTH ROUTES

// show register form
router.get("/register", (req, res)=> {
    res.render("register");
});

// signup logic
router.post("/register", (req, res)=> {
    const newUser = new User({username: req.body.username});
    User.register( newUser, req.body.password, (err, user)=> {
        if(err) {
            // user mongoose local passport error messages
            req.flash("error", err.message);
            console.log(err);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, ()=> {
            req.flash("success", "Welcome to YelpCamp "+ user.username);
            res.redirect("/campgrounds");
        });
    });
})

// show login form
router.get("/login", (req, res)=> {
    res.render("login");
});

// login logic
router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res)=> {    
});

// logout 
router.get("/logout", (req, res)=> {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;