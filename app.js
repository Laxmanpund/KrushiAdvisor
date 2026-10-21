require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");

const User = require("./models/user");

const ExpressError = require("./utils/ExpressError");


const advisorRoutes = require("./routes/advisor");
const cropRoutes = require("./routes/crop");
const diseaseRoutes = require("./routes/disease");
const userRoutes = require("./routes/user");
const dashboardRoutes = require("./routes/dashboard");
const profileRoutes = require("./routes/profile");
const bookingRoutes = require("./routes/booking");
const reviewRoutes = require("./routes/review");

const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();



const MONGO_URL = process.env.ATLAS_URL;

async function main() {
    if (!MONGO_URL) {
        throw new Error("ATLAS_URL is missing from .env");
    }

    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    });



app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));


const sessionOptions = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));

app.use(flash());

app.use(async (req, res, next) => {

    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");

    try {
        if (req.session.userId) {
            const user = await User.findById(req.session.userId);
            res.locals.currentUser = user || null;
        } else {
            res.locals.currentUser = null;
        }

        next();
    } catch (err) {
        next(err);
    }
});



app.get("/", (req, res) => {
    res.render("pages/home");
});

app.use("/crops", cropRoutes);
app.use("/diseases", diseaseRoutes);
app.use("/advisors", advisorRoutes);

app.use("/", userRoutes);
app.use("/", dashboardRoutes);
app.use("/", profileRoutes);
app.use("/", bookingRoutes);
app.use("/", reviewRoutes);

app.get("/about", (req, res) => {
    res.render("pages/about");
});

app.get("/contact", (req, res) => {
    res.render("pages/contact");
});


 // 404 - Page Not Found
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// Central Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!";

    console.error(err);

    res.status(statusCode).render("error", {
        statusCode,
        message
    });
});

app.listen(7426, () => {
    console.log("server is listening port 7426");
});
