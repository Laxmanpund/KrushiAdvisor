const Advisor = require("../models/advisor");
const Review = require("../models/review");



module.exports.index = async (req, res) => {
    try {
        const search = req.query.search || "";
        const location = req.query.location || "";
        const expertise = req.query.expertise || "";
        const experience = req.query.experience || "";
        const fee = req.query.fee || "";
        const available = req.query.available || "";

        const filter = {};

        // Search by advisor name or expertise
        if (search.trim()) {
            filter.$or = [
                { name: { $regex: search.trim(), $options: "i" } },
                { expertise: { $regex: search.trim(), $options: "i" } }
            ];
        }

        // Filter by location
        if (location) {
            filter.location = location;
        }

        // Filter by expertise
        if (expertise) {
            filter.expertise = expertise;
        }

        // Filter by experience
        if (experience) {
            filter.experience = { $gte: Number(experience) };
        }

        // Filter by consultation fee
        if (fee === "500") {
            filter.consultationFee = { $lt: 500 };
        } else if (fee === "500-1000") {
            filter.consultationFee = {
                $gte: 500,
                $lte: 1000
            };
        } else if (fee === "1000") {
            filter.consultationFee = { $gt: 1000 };
        }

        // Show only available advisors when checkbox is selected
        if (available === "true") {
            filter.isAvailable = true;
        }

        const advisors = await Advisor.find(filter).sort({
            rating: -1
        });

        res.render("pages/advisors", {
            advisors,
            search,
            location,
            expertise,
            experience,
            fee,
            available
        });
    } catch (err) {
        console.log(err);
        req.flash("error", "Advisors load karta ale nahi.");
        return res.redirect("/");
    }
};



module.exports.show = async (req, res) => {
    try {
        const advisor = await Advisor.findById(req.params.id);

        if (!advisor) {
            req.flash("error", "Advisor sapadla nahi.");
            return res.redirect("/advisors");
        }

        const reviews = await Review.find({
            advisor: advisor._id
        })
            .populate({
                path: "farmer",
                populate: {
                    path: "user",
                    select: "_id"
                }
            })
            .sort({ createdAt: -1 });

        res.render("pages/advisor-profile", {
            advisor,
            reviews
        });

    } catch (err) {
        console.log(err);
        req.flash("error", "Advisor profile load karta ali nahi.");
        return res.redirect("/advisors");
    }
};
