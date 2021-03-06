const   express     = require('express'),
        path        = require('path'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        flash       = require('connect-flash'),
        passport                = require('passport'),
        LocalStrategy           = require('passport-local'),
        passportLocalMongoose   = require('passport-local-mongoose'),
        methodOverride          = require('method-override'),
        User                    = require('./models/user'),
        Comment     = require('./models/comment'),
        Campground  = require('./models/campground'),
        seedDB      = require('./seeds')

const   campgroundRoutes = require('./routes/campgrounds'),
        commentRoutes    = require('./routes/comments'),
        indexRoutes      = require('./routes/index')

const app = express()
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

// Define paths
const publicDir = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './views')

app.set("view engine", "ejs");
app.set('views', viewsPath);

app.use(express.static(publicDir));
app.use(bodyParser.urlencoded({extended: true}) );
// configure method override with the parameter to look for, to support PUT, DELETE etc through post request
app.use(methodOverride("_method"));
// use connect flash for flash messages
app.use(flash());

// seed DB
// seedDB();

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
// Adding current user to all the routes through middleware
app.use( (req, res, next)=> {
    // request.user information is populated by passport
    res.locals.currentUser = req.user;
    // set the message available for every request to handle flash messages
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    // let the control go to next item in flow
    next();
});

// Register ROUTES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, ()=> {
    console.log("YelpCamp app started..!!");
});