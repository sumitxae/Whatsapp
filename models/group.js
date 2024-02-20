const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    groupName: {
        type: String,
        unique: true
    },
    groupProfileImage: {
        type: String,
        default: "/images/group-default.jpg"
    },
    admin: String,
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
})

module.exports = mongoose.model("group", groupSchema);