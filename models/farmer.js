const mongoose = require("mongoose");
const farmerSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    mobile: {
        type: String,
        default: ""
    },

    village: {
        type: String,
        default: ""
    },

    district: {
        type: String,
        default: ""
    },

    farmingType: {
        type: String,
        default: ""
    },

    farmSize: {
        type: Number,
        default: 0
    }

});

const Farmer = mongoose.model("Farmer", farmerSchema);

module.exports = Farmer;