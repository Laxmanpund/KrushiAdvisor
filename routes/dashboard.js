const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard");
const {isFarmer,isAdvisor} = require("../middleware/auth");


router.get(
    "/farmer/dashboard",
    isFarmer,
    dashboardController.farmerDashboard
);

router.get(
    "/advisor/dashboard",
    isAdvisor,
    dashboardController.advisorDashboard
);



router.post(
    "/advisor/availability",
    isAdvisor,
    dashboardController.toggleAvailability
);


module.exports = router;