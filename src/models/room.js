const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomSchema = new Schema({
    name: { type: String },
    type: { type: String },
    password: { type: String },
    createdBy: { type: String },
    stateCreator: {type: Boolean}
});

module.exports = mongoose.model('room', roomSchema);