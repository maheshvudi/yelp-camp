const   express     = require('express'),
        path        = require('path'),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        Campground  = require('./models/campground'),
        seedDB      = require('./seeds')

const app = express()
mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true});

// Define paths
const publicDir = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './views')

app.set("view engine", "ejs");
app.set('views', viewsPath);

app.use(express.static(publicDir));
app.use(bodyParser.urlencoded({extended: true}) );

// seed DB
seedDB();

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
            res.render('index', {campgrounds: allCampgrounds} );
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
    res.render('new');
});

// SHOW - show details of a campground
app.get("/campgrounds/:id", (req, res)=> {
    console.log(req.params.id);
    Campground.findById(req.params.id).populate("comments").exec( (err, foundCampground)=> {
        if(err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("show", {campground: foundCampground});
        }
    });    
});

app.listen(process.env.PORT, ()=> {
    console.log("listening on port 3000!");
});