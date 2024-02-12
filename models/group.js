const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    groupName: {
        type: String,
        unique: true
    },
    groupProfileImage: {
        type: String,
        default: "https://imgs.search.brave.com/K43njENgzusqy2fByDiKHnZGr6G4daKf-FMov3ndZGc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvZ3JvdXAtdGhl/cmFweS1hZGRpY3Rp/b24tdHJlYXRtZW50/LWNvbmNlcHRfMTAx/Ni02OTgyLmpwZz9z/aXplPTYyNiZleHQ9/anBn"
    },
    admin: String,
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
})

module.exports = mongoose.model("group", groupSchema);