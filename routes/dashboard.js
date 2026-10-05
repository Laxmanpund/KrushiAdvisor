const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard");
const {isFarmer,isAdvisor} = require("../middleware/auth");

// Farmer Dashboard
router.get(
    "/farmer/dashboard",
    isFarmer,
    dashboardController.farmerDashboard
);

// Advisor Dashboard
router.get(
    "/advisor/dashboard",
    isAdvisor,
    dashboardController.advisorDashboard
);

// Advisor Availability
router.post(
    "/advisor/availability",
    isAdvisor,
    dashboardController.toggleAvailability
);

module.exports = router;