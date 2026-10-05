const Disease = require("../models/disease");

module.exports.index = async (req, res) => {
    const diseases = await Disease.find({});
    res.render("pages/diseases", { diseases });
};

module.exports.show = async (req, res) => {
    const disease = await Disease.findById(req.params.id);

    if (!disease) {
        return res.status(404).send("Disease or pest not found");
    }

    res.render("pages/disease-details", { disease });
};