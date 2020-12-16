const mongoose = require('mongoose');
const { Schema } = mongoose;

const videoSchema = new Schema({
    category: { type: String },
    name: { type: String }
});

module.exports = mongoose.model('video', videoSchema);