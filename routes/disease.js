const express = require("express");
const router = express.Router();
const diseaseController = require("../controllers/diseases");

router.get("/", diseaseController.index);
router.get("/:id", diseaseController.show);

module.exports = router;