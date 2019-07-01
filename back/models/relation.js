const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const RelationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
        default: "rgba(100,100,50,1)"
    }
});

module.exports = Relation = mongoose.model('relation', RelationSchema);