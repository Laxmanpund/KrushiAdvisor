const mongoose = require("mongoose");

const advisorSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    qualification: {
        type: String,
        required: true
    },

    expertise: [{
        type: String
    }],

    experience: {
        type: Number,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        default: 0
    },

    consultationFee: {
        type: Number,
        required: true
    },

    isAvailable: {
        type: Boolean,
        default: true
    },

    about: {
        type: String,
        default: ""
    },

    experienceDescription: {
        type: String,
        default: ""
    }
});

const Advisor = mongoose.model("Advisor", advisorSchema);

module.exports = Advisor;