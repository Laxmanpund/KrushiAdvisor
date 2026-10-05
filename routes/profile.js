const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profiles");
const {isLoggedIn} = require("../middleware/auth");

router.get(
    "/profile",
    isLoggedIn,
    profileController.showProfile
);


router.get(
    "/profile/edit",
    isLoggedIn,
    profileController.editProfile
);


router.post(
    "/profile/edit",
    isLoggedIn,
    profileController.updateProfile
);


module.exports = router;