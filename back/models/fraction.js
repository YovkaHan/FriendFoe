const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const FractionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
        default: "http://cdn.onlinewebfonts.com/svg/img_311846.png"
    },
    amount: {
        type: Number,
        default: 1,
    },
    relations: {
        type: Array,
        default: []
    },
    unions: {
        type: Array,
        default: []
    }
});

module.exports = Fraction = mongoose.model('fraction', FractionSchema);