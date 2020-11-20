const mongoose = require('mongoose');
const {Schema} = mongoose;

const groupSchema = new Schema ({
    name: {type:String, default: _id},
    members: {type:String}
});

module.exports = mongoose.model('group', groupSchema);