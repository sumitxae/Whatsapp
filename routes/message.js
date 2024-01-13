const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    msg: {
        type: String,
        required: [
        true,
        'Message is required to initiate a Chat'
        ]
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    // group: {

    // }
}, {
    timestamps: true
})

module.exports = mongoose.model("Message", messageSchema);