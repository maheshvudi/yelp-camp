const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

// Define paths
const publicDir = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './views')

app.set("view engine", "ejs");
app.set('views', viewsPath);

app.use(express.static(publicDir));
app.use(bodyParser.urlencoded({extended: true}) );

var campgrounds = [
    {name : "portsalon",   image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {name : "dunfanaghey", image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {name : "rathmulan",   image: "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {name : "portsalon",   image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {name : "dunfanaghey", image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {name : "rathmulan",   image: "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {name : "portsalon",   image: "https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {name : "dunfanaghey", image: "https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350"},
    {name : "rathmulan",   image: "https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&h=350"}
];

app.get('/', (req, res)=> {
    res.render('landing');
});

app.get("/campgrounds", (req, res)=> {
    res.render('campgrounds', {campgrounds: campgrounds} );
});

app.post("/campgrounds", (req, res)=> {
    let name = req.body.name;
    let image = req.body.image;
    let newCampground = {name, image};
    campgrounds.push( newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
    res.render('new');
});

app.listen(3000, ()=> {
    console.log("listening on port 3000!");
});