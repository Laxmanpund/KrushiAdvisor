const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

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

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    problem: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [
            "pending",
            "accepted",
            "rejected",
            "completed"
        ],
        default: "pending"
    }

}, {
    timestamps: true
});

const Booking = mongoose.model("Booking",bookingSchema);

module.exports = Booking;