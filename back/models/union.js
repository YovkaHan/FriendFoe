const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UnionSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: 'rgba(255,255,0,.54)',
    },
    participants: {
        type: Array,
        default: []
    }
});

module.exports = Union = mongoose.model('union', UnionSchema);