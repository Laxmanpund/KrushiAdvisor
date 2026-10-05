const User = require("../models/user");
const Farmer = require("../models/farmer");
const Advisor = require("../models/advisor");


module.exports.showProfile = async (req, res) => {

    try {
        const user = res.locals.currentUser;
        if (!user) {
            return res.redirect("/login");
        }


        // Farmer Profile

        if (user.role === "farmer") {
            const farmer = await Farmer.findOne({user: user._id});

            if (!farmer) {
                return res.status(404).send(
                    "Farmer profile not found"
                );
            }

            return res.render("users/profile", {user,profile: farmer});
        }


        // Advisor Profile

        if (user.role === "advisor") {
            const advisor = await Advisor.findOne({
                user: user._id
            });

            if (!advisor) {
                return res.status(404).send(
                    "Advisor profile not found"
                );
            }

            return res.render("users/profile", {user,profile: advisor});
        }

        return res.status(403).send("Invalid user role");

    } catch (err) {
        console.log(err);
        res.status(500).send(
            "Something went wrong"
        );
    }
};


// Edit Profile Page


module.exports.editProfile = async (req, res) => {
    try {
        const user = res.locals.currentUser;
        if (!user) {
            return res.redirect("/login");
        }


        if (user.role === "farmer") {
            const farmer = await Farmer.findOne({user: user._id});

            if (!farmer) {
                return res.status(404).send(
                    "Farmer profile not found"
                );
            }

            return res.render("users/profile-edit", {user,profile: farmer});
        }


        if (user.role === "advisor") {
            const advisor = await Advisor.findOne({
                user: user._id
            });

            if (!advisor) {
                return res.status(404).send(
                    "Advisor profile not found"
                );
            }

            return res.render("users/profile-edit", {user,profile: advisor});
        }

        return res.status(403).send(
            "Invalid user role"
        );

    } catch (err) {
        console.log(err);
        res.status(500).send(
            "Something went wrong"
        );
    }
};


// Update Profile

module.exports.updateProfile = async (req, res) => {

    try {
        const user = res.locals.currentUser;
        if (!user) {
            return res.redirect("/login");
        }

        // Farmer Profile

        if (user.role === "farmer") {
            const farmer = await Farmer.findOne({
                user: user._id
            });

            if (!farmer) {
                return res.status(404).send(
                    "Farmer profile not found"
                );
            }

            user.name = req.body.name;
            await user.save();


            // Farmer information
            farmer.name = req.body.name;
            farmer.mobile = req.body.mobile;
            farmer.village = req.body.village;
            farmer.district = req.body.district;
            farmer.farmingType = req.body.farmingType;
            farmer.farmSize = req.body.farmSize;

            await farmer.save();
            return res.redirect("/profile");
        }

        // Advisor Profile

        if (user.role === "advisor") {
            const advisor = await Advisor.findOne({
                user: user._id
            });

            if (!advisor) {
                return res.status(404).send(
                    "Advisor profile not found"
                );
            }
            user.name = req.body.name;
            await user.save();


            // Advisor information
            advisor.name = req.body.name;
            advisor.qualification =req.body.qualification;

            advisor.expertise =
                req.body.expertise
                    .split(",")
                    .map(item => item.trim())
                    .filter(item => item !== "");

            advisor.experience =req.body.experience;
            advisor.location =req.body.location;
            advisor.consultationFee =req.body.consultationFee;
            advisor.about =req.body.about;
            advisor.experienceDescription =req.body.experienceDescription;

            await advisor.save();

            return res.redirect("/profile");
        }
        return res.status(403).send(
            "Invalid user role"
        );
    } catch (err) {
        console.log(err);
        res.status(500).send(
            "Something went wrong"
        );
    }
};