const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviews");
const { isFarmer, isLoggedIn } = require("../middleware/auth");

// Open review form
router.get(
    "/farmer/bookings/:id/review",
    isFarmer,
    reviewController.reviewForm
);

// Submit review
router.post(
    "/farmer/bookings/:id/review",
    isFarmer,
    reviewController.createReview
);

// Delete review
router.post(
    "/reviews/:id/delete",
    isLoggedIn,
    reviewController.deleteReview
);

module.exports = router;
