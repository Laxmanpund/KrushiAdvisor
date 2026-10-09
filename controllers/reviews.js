
const Review = require("../models/review");
const Booking = require("../models/booking");
const Farmer = require("../models/farmer");
const Advisor = require("../models/advisor");

// Recalculate advisor average rating
async function updateAdvisorRating(advisorId) {
    const result = await Review.aggregate([
        {
            $match: {
                advisor: advisorId
            }
        },
        {
            $group: {
                _id: "$advisor",
                averageRating: { $avg: "$rating" }
            }
        }
    ]);

    const averageRating = result.length
        ? Number(result[0].averageRating.toFixed(1))
        : 0;

    await Advisor.findByIdAndUpdate(advisorId, {
        rating: averageRating
    });
}

// Review Form
module.exports.reviewForm = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("advisor");

        if (!booking) {
            req.flash("error", "Booking sapadli nahi.");
            return res.redirect("/farmer/dashboard");
        }

        const farmer = await Farmer.findOne({
            user: req.session.userId
        });

        if (!farmer) {
            req.flash("error", "Farmer profile sapadli nahi.");
            return res.redirect("/farmer/dashboard");
        }

        if (booking.farmer.toString() !== farmer._id.toString()) {
            req.flash("error", "Ya booking sathi access nahi.");
            return res.redirect("/farmer/dashboard");
        }

        if (booking.status !== "completed") {
            req.flash(
                "error",
                "Consultation complete zalyanantarch review deta yeil."
            );
            return res.redirect("/farmer/dashboard");
        }

        res.render("pages/review-form", { booking });
    } catch (err) {
        console.log(err);
        req.flash("error", "Review form open karta ala nahi.");
        res.redirect("/farmer/dashboard");
    }
};

// Create Review
module.exports.createReview = async (req, res) => {
    let advisorId;

    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            req.flash("error", "Booking sapadli nahi.");
            return res.redirect("/farmer/dashboard");
        }

        advisorId = booking.advisor;

        const farmer = await Farmer.findOne({
            user: req.session.userId
        });

        if (!farmer) {
            req.flash("error", "Farmer profile sapadli nahi.");
            return res.redirect("/farmer/dashboard");
        }

        if (booking.farmer.toString() !== farmer._id.toString()) {
            req.flash("error", "Ya booking sathi access nahi.");
            return res.redirect("/farmer/dashboard");
        }

        if (booking.status !== "completed") {
            req.flash(
                "error",
                "Fakt completed consultation sathi review deta yeil."
            );
            return res.redirect("/farmer/dashboard");
        }

        const rating = Number(req.body.rating);
        const comment = (req.body.comment || "").trim();

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            req.flash("error", "Rating 1 te 5 stars madhye nivda.");
            return res.redirect(`/advisors/${advisorId}`);
        }

        if (!comment) {
            req.flash("error", "Kripaya tumcha abhipray liha.");
            return res.redirect(`/advisors/${advisorId}`);
        }

        if (comment.length > 2000) {
            req.flash("error", "Review 2000 characters peksha motha nasava.");
            return res.redirect(`/advisors/${advisorId}`);
        }

        await Review.create({
            farmer: farmer._id,
            advisor: advisorId,
            booking: booking._id,
            rating,
            comment
        });

        await updateAdvisorRating(advisorId);

        req.flash("success", "Review added successfully!");
        return res.redirect(`/advisors/${advisorId}`);
    } catch (err) {
        console.log(err);

        req.flash("error", "Review save karta ala nahi.");

        if (advisorId) {
            return res.redirect(`/advisors/${advisorId}`);
        }

        return res.redirect("/farmer/dashboard");
    }
};

// Delete Review — only review owner or admin
module.exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            req.flash("error", "Review aadhich delete zala aahe kiwa sapadla nahi.");
            return res.redirect("/advisors");
        }

        const currentUser = res.locals.currentUser;

        if (!currentUser) {
            req.flash("error", "Review delete karanyasathi login kara.");
            return res.redirect("/login");
        }

        let isOwner = false;

        if (currentUser.role === "farmer") {
            const farmer = await Farmer.findOne({
                user: currentUser._id
            });

            isOwner =
                !!farmer &&
                review.farmer.toString() === farmer._id.toString();
        }

        const isAdmin = currentUser.role === "admin";

        if (!isOwner && !isAdmin) {
            req.flash("error", "Tumhi fakt tumcha review delete karu shakta.");
            return res.redirect(`/advisors/${review.advisor}`);
        }

        const advisorId = review.advisor;

        await Review.findByIdAndDelete(review._id);
        await updateAdvisorRating(advisorId);

        req.flash("success", "Review deleted successfully!");
        return res.redirect(`/advisors/${advisorId}`);
        
    } catch (err) {
        console.log(err);
        req.flash("error", "Review delete karta ala nahi.");
        return res.redirect("/advisors");
    }
};
