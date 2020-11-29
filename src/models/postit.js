const mongoose = require('mongoose');
const { Schema } = mongoose;

const postItSchema = new Schema({
    user: { type: String },
    description: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('postit', postItSchema);