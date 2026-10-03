const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");

const Crop = require("./models/crop");

const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();


const MONGO_URL = "mongodb://127.0.0.1:27017/krushi-advisor";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });


app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));


const sessionOptions = {
    secret: "krushi-advisor-secret",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());


app.get("/", (req, res) => {
    res.render("pages/home");
});

app.get("/crops", (req, res) => {
    res.render("pages/crops");
});

app.get("/crops/wheat", (req, res) => {
    res.render("pages/crop-details");
});

app.get("/diseases", (req, res) => {
    res.render("pages/diseases");
});

app.get("/diseases/wheat-rust", (req, res) => {
    res.render("pages/disease-details");
});

app.get("/advisors", (req, res) => {
    res.render("pages/advisors");
});

app.get("/advisors/rajesh-patil", (req, res) => {
    res.render("pages/advisor-profile");
});

app.get("/about", (req, res) => {
    res.render("pages/about");
});

app.get("/contact", (req, res) => {
    res.render("pages/contact");
});

app.listen(7426, () => {
    console.log("server is listening port 7426");
});
