const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Register page
router.get("/register", (req, res) => {
    res.render("users/register.ejs");
});

// Register user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            req.flash("error", "Please fill in all fields.");
            return res.redirect("/register");
        }

        if (password !== confirmPassword) {
            req.flash("error", "Passwords do not match.");
            return res.redirect("/register");
        }

        if (password.length < 8) {
            req.flash("error", "Password must be at least 8 characters.");
            return res.redirect("/register");
        }

        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            req.flash("error", "Email is already registered.");
            return res.redirect("/register");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword
        });

        await newUser.save();

        req.flash("success", "Registration successful! Please login.");
        return res.redirect("/login");

    } catch (err) {
        if (err.code === 11000) {
            req.flash("error", "Email is already registered.");
            return res.redirect("/register");
        }

        console.error("Registration error:", err);
        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/register");
    }
});

module.exports = router;
