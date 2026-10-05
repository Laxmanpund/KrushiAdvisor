const Advisor = require("../models/advisor");


module.exports.farmerDashboard = async (req, res) => {

    const advisors = await Advisor.find({
        isAvailable: true
    });

    res.render("pages/farmer-dashboard", {advisors});
};



// Advisor Dashboard

module.exports.advisorDashboard = async (req, res) => {
    const advisor = await Advisor.findOne({
        user: req.session.userId
    });

    if (!advisor) {
        return res.status(404).send(
            "Advisor profile not found"
        );
    }

    res.render("pages/advisor-dashboard", {advisor});
};


// Toggle Advisor Availability


module.exports.toggleAvailability = async (req, res) => {
    const advisor = await Advisor.findOne({
        user: req.session.userId
    });

    if (!advisor) {
        return res.status(404).send(
            "Advisor profile not found"
        );
    }

    advisor.isAvailable = !advisor.isAvailable;
    await advisor.save();
    res.redirect("/advisor/dashboard");
};