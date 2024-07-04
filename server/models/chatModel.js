const mongoose = require('mongoose');

const chatModel = new mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        isGroupChat: { type: Boolean, default: false },
        groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        letestMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
    },
    { timestamps: true }
);

const Chat = mongoose.model('Chat', chatModel);

module.exports = Chat;
