const mongoose = require('mongoose');
const {Schema} = mongoose;

const roomSchema = new Schema ({
    name: {type:String},
    members: {type:String}
});

module.exports = mongoose.model('room', roomSchema);