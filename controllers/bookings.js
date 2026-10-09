const Booking = require("../models/booking");
const Advisor = require("../models/advisor");
const Farmer = require("../models/farmer");


module.exports.bookingForm = async (req, res) => {
    try {
        const advisor = await Advisor.findById(req.params.id);

        if (!advisor) {
            return res.status(404).send("Advisor not found");
        }

        if (!advisor.isAvailable) {
            return res.status(400).send("Advisor is currently unavailable");
        }

        res.render("pages/booking-form", {advisor});

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};


// Create Booking

// ==========================================
// Create Booking
// ==========================================

module.exports.createBooking = async (req, res) => {

    try {

        const advisor = await Advisor.findById(
            req.params.id
        );

        if (!advisor) {
            return res.status(404).send(
                "Advisor not found"
            );
        }


        // Check advisor availability

        if (!advisor.isAvailable) {
            return res.status(400).send(
                "Advisor is currently unavailable"
            );
        }


        // Find logged-in farmer

        const farmer = await Farmer.findOne({
            user: req.session.userId
        });

        if (!farmer) {
            return res.status(404).send(
                "Farmer profile not found"
            );
        }


        const {
            date,
            time,
            problem
        } = req.body;


        // ==========================================
        // Validate Date
        // ==========================================

        if (!date) {
            return res.status(400).send(
                "Please select a date"
            );
        }


        const selectedDate = new Date(
            `${date}T00:00:00`
        );

        const today = new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        // Past date check

        if (selectedDate < today) {
            return res.status(400).send(
                "You cannot book a consultation for a past date"
            );
        }


        // ==========================================
        // Validate Time
        // ==========================================

        if (!time) {
            return res.status(400).send(
                "Please select a time"
            );
        }


        // ==========================================
        // Validate Problem
        // ==========================================

        if (!problem || problem.trim() === "") {
            return res.status(400).send(
                "Please describe your problem"
            );
        }


        // ==========================================
        // Check Duplicate Booking
        // ==========================================

        const existingBooking = await Booking.findOne({

            advisor: advisor._id,

            date: selectedDate,

            time: time,

            status: {
                $in: [
                    "pending",
                    "accepted"
                ]
            }

        });


        if (existingBooking) {

            return res.status(400).send(
                "This time slot is already booked. Please select another time."
            );

        }


        // Create Booking

        const booking = new Booking({
            farmer: farmer._id,
            advisor: advisor._id,
            date: selectedDate,
            time: time,
            problem: problem.trim(),
            status: "pending"
        });

        await booking.save();
        res.redirect("/farmer/dashboard#myBookings");

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

// Farmer Bookings

module.exports.farmerBookings = async (req, res) => {
    try {
        const farmer = await Farmer.findOne({user: req.session.userId});

        if (!farmer) {
            return res.status(404).send("Farmer profile not found");
        }

        const bookings = await Booking.find({
            farmer: farmer._id
        })
        .populate("advisor")
        .sort({
            date: 1
        });

        res.render("pages/farmer-bookings", {bookings});

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};

// Advisor Bookings

module.exports.advisorBookings = async (req, res) => {
    try {
        const advisor = await Advisor.findOne({user: req.session.userId});

        if (!advisor) {
            return res.status(404).send("Advisor profile not found");
        }

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

// Accept Booking
module.exports.acceptBooking = async (req, res) => {
    try {
        const advisor = await Advisor.findOne({user: req.session.userId});

        if (!advisor) {
            return res.status(404).send("Advisor profile not found");
        }

        // Find booking belonging to this advisor
        const booking = await Booking.findOne({
            _id: req.params.id,
            advisor: advisor._id
        });

        if (!booking) {
            return res.status(404).send("Booking not found");
        }

        // Only pending booking can be accepted
        if (booking.status !== "pending") {
            return res.status(400).send("This booking is already processed");
        }
        booking.status = "accepted";

        await booking.save();
        res.redirect("/advisor/dashboard");

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};


// Reject Booking

module.exports.rejectBooking = async (req, res) => {
    try {
        const advisor = await Advisor.findOne({user: req.session.userId});

        if (!advisor) {
            return res.status(404).send(
                "Advisor profile not found"
            );
        }

        // Find booking belonging to this advisor
        const booking = await Booking.findOne({
            _id: req.params.id,
            advisor: advisor._id
        });

        if (!booking) {
            return res.status(404).send(
                "Booking not found"
            );
        }

        // Only pending booking can be rejected
        if (booking.status !== "pending") {
            return res.status(400).send(
                "This booking is already processed"
            );
        }
        booking.status = "rejected";

        await booking.save();
        res.redirect("/advisor/dashboard");

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};


// Complete Booking

module.exports.completeBooking = async (req, res) => {
    try {
        const advisor = await Advisor.findOne({user: req.session.userId});

        if (!advisor) {
            return res.status(404).send(
                "Advisor profile not found"
            );
        }


        const booking = await Booking.findOne({
            _id: req.params.id,
            advisor: advisor._id
        });


        if (!booking) {
            return res.status(404).send(
                "Booking not found"
            );
        }


        if (booking.status !== "accepted") {
            return res.status(400).send(
                "Only accepted bookings can be completed"
            );

        }

        booking.status = "completed";
        await booking.save();
        res.redirect("/advisor/dashboard");

    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
};