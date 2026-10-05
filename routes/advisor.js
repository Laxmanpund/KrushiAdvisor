const express = require("express");
const router = express.Router();
const advisorController = require("../controllers/advisors");

router.get("/", advisorController.index);
router.get("/:id", advisorController.show);

module.exports = router;