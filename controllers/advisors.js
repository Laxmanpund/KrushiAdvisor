const Advisor = require("../models/advisor");

module.exports.index = async (req, res) => {
    const {search,location,expertise,experience,fee,available} = req.query;
    let filter = {};

    if (search) {
        filter.$or = [
            {
                name: {
                    $regex: search,
                    $options: "i"
                }
            },
            {
                expertise: {
                    $regex: search,
                    $options: "i"
                }
            }
        ];
    }

    if (location) {
        filter.location = location;
    }

    if (expertise) {
        filter.expertise = expertise;
    }

    if (experience) {
        filter.experience = {
            $gte: Number(experience)
        };
    }

    if (fee === "500") {
        filter.consultationFee = {
            $lt: 500
        };
    }

    if (fee === "500-1000") {
        filter.consultationFee = {
            $gte: 500,
            $lte: 1000
        };
    }

    if (fee === "1000") {
        filter.consultationFee = {
            $gt: 1000
        };
    }

    if (available === "true") {
        filter.isAvailable = true;
    }

    const advisors = await Advisor.find(filter);
    res.render("pages/advisors", {
        advisors,
        search: search || "",
        location: location || "",
        expertise: expertise || "",
        experience: experience || "",
        fee: fee || "",
        available: available || ""
    });
};


module.exports.show = async (req, res) => {
    const advisor = await Advisor.findById(req.params.id);
    if (!advisor) {
        return res.status(404).send("Advisor not found");
    }

    res.render("pages/advisor-profile", {advisor});
};