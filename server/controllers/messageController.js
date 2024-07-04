const Chat = require('../models/chatModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log('Invalid data passed into request!!');
        return res.status(400);
    }
    // creating options need to pass the MessageModel
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    try {
        let message = await Message.create(newMessage);
        /*
        // polulate the sender with the name and pic from message
        message = await message.populate('sender', 'name pic');
        // polulate the chat from message
        message = await message.populate('chat');
        // inside the chat we have users array (object_id) need to polulate
        // populating the users array from chat object present in MessageModel
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email ',
        });
        */

        // the shorter way to find
        message = await message.populate('sender', 'name pic');
        message = await message.populate({
            path: 'chat',
            populate: {
                path: 'users',
                select: 'name pic email',
            },
        });

        // updating the latest message in chatModel
        await Chat.findByIdAndUpdate(req.body.chatId, { letestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
};

const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate('sender', 'name pic email')
            .populate('chat');
        // .populate({
        //     path: 'chat',
        //     populate: {
        //         path: 'users',
        //     },
        // });

        return res.json(messages);
    } catch (error) {
        res.status(400).json({ message: error.message, success: false });
    }
};

module.exports = { sendMessage, allMessages };
