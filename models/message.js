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
    },
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'group'
    },
    isGroup:{
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Message", messageSchema);