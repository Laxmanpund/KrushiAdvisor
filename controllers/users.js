
const User = require("../models/user");
const Advisor = require("../models/advisor");
const Farmer = require("../models/farmer");
const bcrypt = require("bcrypt");

// Signup Page
module.exports.signupForm = (req, res) => {
    res.render("users/signup");
};

// Signup
module.exports.signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role } = req.body;

        if (password !== confirmPassword) {
            req.flash("error", "Passwords do not match.");
            return res.redirect("/signup");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            req.flash("error", "Email already registered.");
            return res.redirect("/signup");
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const userRole = role === "advisor" ? "advisor" : "farmer";
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: userRole
        });

        await user.save();

        // Create profile based on role
        if (userRole === "advisor") {
            const advisor = new Advisor({
                user: user._id,
                name,
                qualification: "",
                expertise: [],
                experience: 0,
                location: "",
                consultationFee: 0,
                isAvailable: false,
                about: "",
                experienceDescription: ""
            });

            await advisor.save();
        } else {
            const farmer = new Farmer({
                user: user._id,
                name,
                mobile: "",
                village: "",
                district: "",
                farmingType: "",
                farmSize: 0
            });

            await farmer.save();
        }

        // Automatic login after signup
        req.session.userId = user._id;
        req.flash("success", "Account created successfully! Welcome to Krushi Advisor.");
        req.session.save((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Session error");
            }

            return res.redirect("/");
        });

    } catch (err) {
        console.log(err);
        req.flash("error", "Signup failed. Please try again.");
        return res.redirect("/signup");
    }
};

// Login Page
module.exports.loginForm = (req, res) => {
    res.render("users/login");
};

// Login
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            req.flash("error", "Invalid email or password.");
            return res.redirect("/login");
        }

        req.session.userId = user._id;
        req.flash("success", "Login successful! Welcome back.");
        req.session.save((err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Session error");
            }

            return res.redirect("/");
        });

    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong during login.");
        return res.redirect("/login");
    }
};

// Logout
module.exports.logout = (req, res, next) => {
    req.flash("success", "Logout successful!");
    delete req.session.userId;
    req.session.save((saveErr) => {
        if (saveErr) {
            console.log(saveErr);
            return next(saveErr);
        }

    
        req.session.regenerate((err) => {
            if (err) {
                console.log(err);
                return next(err);
            }

            // New session madhye flash message set kara
            req.flash("success", "Logout successful!");

            req.session.save((finalErr) => {
                if (finalErr) {
                    console.log(finalErr);
                    return next(finalErr);
                }

                return res.redirect("/");
            });
        });
    });
};
