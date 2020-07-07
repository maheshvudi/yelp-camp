const   express     = require('express'),
        path        = require('path'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        passport                = require('passport'),
        LocalStrategy           = require('passport-local'),
        passportLocalMongoose   = require('passport-local-mongoose'),
        User                    = require('./models/user'),
        Comment     = require('./models/comment'),
        Campground  = require('./models/campground'),
        seedDB      = require('./seeds')

const app = express()
//mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

// Define paths
const publicDir = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './views')

app.set("view engine", "ejs");
app.set('views', viewsPath);

app.use(express.static(publicDir));
app.use(bodyParser.urlencoded({extended: true}) );

// seed DB
seedDB();

// PASSPORT CONFIG
app.use(require('express-session')({
    secret: "this is secret pass phrase",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use( new LocalStrategy(User.authenticate()) );
passport.serializeUser( User.serializeUser());
passport.deserializeUser( User.deserializeUser());

// MIDDLEWARE

// middleware checks user login
const  isLoggedIn = (req, res, next)=> {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

// Adding current user to all the routes through middleware
app.use( (req, res, next)=> {
    // request.user information is populated by passport
    res.locals.currentUser = req.user;
    // let the control go to next item in flow
    next();
});

// ROUTES

// INDEX 
app.get('/', (req, res)=> {
    res.render('landing');
});

// INDEX - show all campgrounds
app.get("/campgrounds", (req, res)=> {
    Campground.find({}, (err, allCampgrounds)=> {
        if(err) {
            console.log("Error fetching campgrounds");
        } else {
            res.render('campgrounds/index', {campgrounds: allCampgrounds} );
        }        
    });
});

// CREATE - add a new campground
app.post("/campgrounds", (req, res)=> {
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
app.get("/campgrounds/new", (req, res) => {
    res.render('campgrounds/new');
});

// SHOW - show details of a campground
app.get("/campgrounds/:id", (req, res)=> {
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

// ========================
// COMMENTS ROUTES
// ========================
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res)=> {
    Campground.findById(req.params.id, (err, campground)=> {
        if(err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground});
        }
    });    
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res)=> {
    Campground.findById(req.params.id, (err, campground)=> {
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment)=> {
                if(err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+ campground._id);
                }
            });    
        }
    });    

});

// AUTH ROUTES

// show register form
app.get("/register", (req, res)=> {
    res.render("register");
});

// signup logic
app.post("/register", (req, res)=> {
    const newUser = new User({username: req.body.username});
    User.register( newUser, req.body.password, (err, user)=> {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, ()=> {
            res.redirect("/campgrounds");
        });
    });
})

// show login form
app.get("/login", (req, res)=> {
    res.render("login");
});

// loin logic
app.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res)=> {    
});

// logout 
app.get("/logout", (req, res)=> {
    req.logout();
    res.redirect("/campgrounds");
});


app.listen(3000, ()=> {
    console.log("listening on port 3000!");
});