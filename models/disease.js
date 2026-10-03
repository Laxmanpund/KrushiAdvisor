const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    crop: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    symptoms: [
        {
            type: String
        }
    ],
    favorableConditions: [
        {
            type: String
        }
    ],
    management: [
        {
            type: String
        }
    ],
    prevention: [
        {
            type: String
        }
    ]
});

const Disease = mongoose.model("Disease", diseaseSchema);

module.exports = Disease;