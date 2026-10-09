
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Farmer",
            required: true
        },

        advisor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Advisor",
            required: true
        },

        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
