const Crop = require("../models/crop");

module.exports.index = async (req, res) => {
    const crops = await Crop.find({});
    res.render("pages/crops", { crops });
};

module.exports.show = async (req, res) => {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
        return res.status(404).send("Crop not found");
    }

    res.render("pages/crop-details", { crop });
};