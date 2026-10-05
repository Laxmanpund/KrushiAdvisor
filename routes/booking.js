const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookings");
const {isFarmer,isAdvisor} = require("../middleware/auth");


// Booking Form
router.get(
    "/advisors/:id/book",
    isFarmer,
    bookingController.bookingForm
);

// Create Booking
router.post(
    "/advisors/:id/book",
    isFarmer,
    bookingController.createBooking
);

// Farmer Bookings
router.get(
    "/farmer/bookings",
    isFarmer,
    bookingController.farmerBookings
);

// Advisor Bookings
router.get(
    "/advisor/bookings",
    isAdvisor,
    bookingController.advisorBookings
);

// Accept Booking
router.post(
    "/advisor/bookings/:id/accept",
    isAdvisor,
    bookingController.acceptBooking
);

// Reject Booking
router.post(
    "/advisor/bookings/:id/reject",
    isAdvisor,
    bookingController.rejectBooking
);


module.exports = router;