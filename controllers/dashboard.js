const Advisor = require("../models/advisor");
const Booking = require("../models/booking");
const Farmer = require("../models/farmer");


module.exports.farmerDashboard = async (req, res) => {
    try {
        const advisors = await Advisor.find({isAvailable: true});
        const farmer = await Farmer.findOne({user: req.session.userId});

        if (!farmer) {
            return res.status(404).send(
                "Farmer profile not found"
            );
        }


        // Farmer Bookings
        const bookings = await Booking.find({
            farmer: farmer._id
        })
        .populate("advisor")
        .sort({
            date: 1
        });

        // Render Farmer Dashboard
        res.render("pages/farmer-dashboard", {advisors,bookings});

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};


// Advisor Dashboard

module.exports.advisorDashboard = async (req, res) => {
    try {

        // Logged-in Advisor
        const advisor = await Advisor.findOne({
            user: req.session.userId
        });

        if (!advisor) {
            return res.status(404).send(
                "Advisor profile not found"
            );
        }

        // Consultation Requests
        const bookings = await Booking.find({
            advisor: advisor._id
        })
        .populate("farmer")
        .sort({
            date: 1
        });

        res.render("pages/advisor-dashboard", {advisor,bookings});

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};


// Toggle Advisor Availability

module.exports.toggleAvailability = async (req, res) => {
    try {
        const advisor = await Advisor.findOne({user: req.session.userId});

        if (!advisor) {
            return res.status(404).send(
                "Advisor profile not found"
            );
        }

        advisor.isAvailable = !advisor.isAvailable;

        await advisor.save();
        res.redirect("/advisor/dashboard");

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};