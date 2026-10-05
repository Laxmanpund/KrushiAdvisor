const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.get("/signup", userController.signupForm);
router.post("/signup", userController.signup);
router.get("/login", userController.loginForm);
router.post("/login", userController.login);
router.get("/logout", userController.logout);

module.exports = router;