const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");

const Crop = require("./models/crop");
const Disease = require("./models/disease");
const Advisor = require("./models/advisor");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const {isLoggedIn,isFarmer,isAdvisor,isAdmin} = require("./middleware/auth");

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

app.use(async (req, res, next) => {
    if (req.session.userId) {
        const user = await User.findById(req.session.userId);
        res.locals.currentUser = user;
    } else {
        res.locals.currentUser = null;
    }
    next();
});


app.get("/", (req, res) => {
    res.render("pages/home");
});

app.get("/crops", async (req, res) => {
    const crops = await Crop.find({});
    res.render("pages/crops", { crops });
});


app.get("/crops/:id", async (req, res) => {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
        return res.status(404).send("Crop not found");
    }
    res.render("pages/crop-details", { crop });
});

app.get("/diseases", async (req, res) => {
    const diseases = await Disease.find({});
    res.render("pages/diseases", { diseases });
});


app.get("/diseases/:id", async (req, res) => {
    const disease = await Disease.findById(req.params.id);
    if (!disease) {
        return res.status(404).send("Disease or pest not found");
    }
    res.render("pages/disease-details", { disease });
});

app.get("/advisors", async (req, res) => {
    const advisors = await Advisor.find({});
    res.render("pages/advisors", { advisors });
});


app.get("/advisors/:id", async (req, res) => {
    const advisor = await Advisor.findById(req.params.id);
    if (!advisor) {
        return res.status(404).send("Advisor not found");
    }
    res.render("pages/advisor-profile", { advisor });
});

app.get("/signup", (req, res) => {
    res.render("users/signup");
});

app.post("/signup", async (req, res) => {
    try {
        const {name,email,password,confirmPassword,role} = req.body;
        if (password !== confirmPassword) {
            return res.status(400).send("Passwords do not match");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const userRole = role === "advisor"
            ? "advisor"
            : "farmer";

        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: userRole
        });

        await user.save();
        res.send("Account created successfully!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

app.get("/login", (req, res) => {
    res.render("users/login");
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).send("Invalid email or password");
        }
        req.session.userId = user._id;
        res.send("Login successful!");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Logout failed");
        }
        res.redirect("/");
    });
});

app.get("/farmer/dashboard", isFarmer, async (req, res) => {
    const advisors = await Advisor.find({
        isAvailable: true
    });
    res.render("pages/farmer-dashboard", {
        advisors
    });
});

app.get("/advisor/dashboard", isAdvisor, async (req, res) => {
    const advisor = await Advisor.findOne({
        user: req.session.userId
    });
    if (!advisor) {
        return res.status(404).send("Advisor profile not found");
    }
    res.render("pages/advisor-dashboard", { advisor });
});

// Show advisor profile edit page
app.get("/advisor/profile/edit", isAdvisor, async (req, res) => {
    const advisor = await Advisor.findOne({
        user: req.session.userId
    });

    if (!advisor) {
        return res.status(404).send("Advisor profile not found");
    }

    res.render("pages/advisor-profile-edit", { advisor });
});


// Update advisor profile
app.post("/advisor/profile/edit", isAdvisor, async (req, res) => {
    const advisor = await Advisor.findOne({
        user: req.session.userId
    });

    if (!advisor) {
        return res.status(404).send("Advisor profile not found");
    }

    advisor.name = req.body.name;
    advisor.qualification = req.body.qualification;
    advisor.expertise = req.body.expertise
        .split(",")
        .map(item => item.trim())
        .filter(item => item !== "");

    advisor.experience = req.body.experience;
    advisor.location = req.body.location;
    advisor.consultationFee = req.body.consultationFee;
    advisor.about = req.body.about;
    advisor.experienceDescription = req.body.experienceDescription;
    await advisor.save();

    res.redirect("/advisor/dashboard");
});

app.post("/advisor/availability", isAdvisor, async (req, res) => {
    const advisor = await Advisor.findOne({
        user: req.session.userId
    });

    if (!advisor) {
        return res.status(404).send("Advisor profile not found");
    }
    advisor.isAvailable = !advisor.isAvailable;
    await advisor.save();

    res.redirect("/advisor/dashboard");
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
