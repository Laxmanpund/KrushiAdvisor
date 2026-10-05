const express = require("express");
const router = express.Router();
const cropController = require("../controllers/crops");

router.get("/", cropController.index);
router.get("/:id", cropController.show);

module.exports = router;