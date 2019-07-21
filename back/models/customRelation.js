const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const RelationSchema = new Schema({
    relation: {
        type: String,
        required: true,
    },
    a: {
        type: String,
        required: true
    },
    b: {
        type: String,
        required: true
    }
});

module.exports = CustomRelation = mongoose.model('customRelation', RelationSchema);