const User = require("../models/user");
const Advisor = require("../models/advisor");
const Farmer = require("../models/farmer");
const bcrypt = require("bcrypt");


module.exports.signupForm = (req, res) => {
    res.render("users/signup");
};


module.exports.signup = async (req, res) => {
    try {
        const {name,email,password,confirmPassword,role} = req.body;

        if (password !== confirmPassword) {
            return res.status(400).send(
                "Passwords do not match"
            );
        }

        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.status(400).send(
                "Email already registered"
            );
        }

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        const userRole = role === "advisor" ? "advisor" : "farmer";
        const user = new User({name,email,password: hashedPassword,role: userRole});

        await user.save();

        // Create Profile Based On Role

        if (userRole === "advisor") {
            const advisor = new Advisor({
                user: user._id,
                name: name,
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
        }

        if (userRole === "farmer") {
            const farmer = new Farmer({
                user: user._id,
                name: name,
                mobile: "",
                village: "",
                district: "",
                farmingType: "",
                farmSize: 0
            });

            await farmer.save();
        }

        // Automatic Login After Signup

        req.session.userId = user._id;
        res.redirect("/");

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

// Login Page

module.exports.loginForm = (req, res) => {
    res.render("users/login");
};


module.exports.login = async (req, res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).send(
                "Invalid email or password"
            );
        }

        const isPasswordCorrect =await bcrypt.compare(password,user.password);

        if (!isPasswordCorrect) {
            return res.status(400).send(
                "Invalid email or password"
            );
        }

        req.session.userId = user._id;
        res.redirect("/");

    } catch (err) {
        console.log(err);
        res.status(500).send(
            "Something went wrong"
        );
    }
};


// Logout

module.exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send(
                "Logout failed"
            );
        }

        res.redirect("/");
    });
};