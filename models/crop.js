const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    season: {
        type: String,
        required: true
    },

    soil: {
        type: String,
        required: true
    },

    irrigation: {
        type: String,
        required: true
    },

    sowing: {
        type: String,
        required: true
    },

    harvesting: {
        type: String,
        required: true
    },

    fertilizer: {
        type: String,
        required: true
    },

    commonDiseases: [
        {
            type: String
        }
    ]
});

const Crop = mongoose.model("Crop", cropSchema);

module.exports = Crop;