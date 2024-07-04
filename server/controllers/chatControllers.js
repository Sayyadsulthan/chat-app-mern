const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const accessChat = async (req, res) => {
    try {
        // one on one chats and this will return same chats for both users
        const { userId } = req.body;

        if (!userId) {
            console.log('userId  not sent with request body!!');
            return res
                .status(400)
                .json({ message: 'userId params not sent with request!!', success: false });
        }

        // and operator need to pass both expression to be true
        let isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                {
                    users: { $elemMatch: { $eq: req.user._id } },
                },
                {
                    users: { $elemMatch: { $eq: userId } },
                },
            ],
        })
            .populate('users', '-password')
            .populate('letestMessage');

        // populating the user model and
        // getting the user from the chatModels latest message
        // latest msg is pointing to message model and has sender
        isChat = await User.populate(isChat, {
            path: 'letestMessage.sender',
            select: 'name, email, pic',
        });

        // if the chatData found
        if (isChat.length > 0) {
            // res.status(200).json()
            return res.send(isChat[0]);
        } else {
            // creating the chats model with user[logged in user and which user need to chat with]
            let chatData = {
                chatName: 'sender',
                isGroupChat: false,
                users: [req.user._id, userId],
            };

            try {
                const createdChat = await Chat.create(chatData);

                const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                    'users',
                    '-password'
                );

                return res.status(200).send(fullChat);
                // return res
                //     .status(200)
                //     .json({ message: 'group created successfull..', success: true, fullChat });
            } catch (err) {
                res.status(400).json({ message: err.message, success: false });
            }
        }
    } catch (err) {
        console.log(err.stack);
        res.status(400).json({ message: err.stack, success: false });
    }
};

const fetchChats = (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('letestMessage')
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                // need to check later
                results = await User.populate(results, {
                    path: 'latestMessage.sender',
                    select: 'name pic email',
                });
                res.status(200).send(results);
            });
    } catch (err) {
        res.status(400).json({
            message: err.message,
            success: false,
        });
    }
};

const createGroup = async (req, res) => {
    try {
        // required users and group name to create a group
        if (!req.body.users || !req.body.name) {
            return res.status(400).json({ message: 'Please fill all fields!!', success: false });
        }

        // parsing the user to json
        let users = JSON.parse(req.body.users);
        // if the users array <=1
        if (users.length < 2) {
            return res.status(400).json({
                message: 'More then 2 users required to create a group chat!!',
                success: false,
            });
        }

        // adding the logged in / creating group user to users array
        users.push(req.user);

        try {
            // creating a group chat
            const groupChat = await Chat.create({
                chatName: req.body.name,
                users,
                isGroupChat: true,
                groupAdmin: req.user,
            });

            // finding group chat by created group ID
            const fullGroupChat = await Chat.findOne({
                _id: groupChat._id,
            })
                .populate('users', '-password')
                .populate('groupAdmin', '-password');

            res.status(201).json(fullGroupChat);
            // res.status(201).json({message:"Group creation successfull...", success:true,fullGroupChat});
        } catch (err) {
            res.status(400).json({
                message: err.message,
                success: false,
            });
        }
    } catch (err) {
        res.status(400).json({ message: err.message, success: false });
    }
};

const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;
    if (!chatId || !chatName) {
        return res.status(400).json({ message: 'Please add chatName and chatId', success: false });
    }
    try {
        const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        if (!updatedChat) {
            res.status(404).json({ message: 'Chat not found!!', success: false });
        }
        res.status(200).json(updatedChat);
        // res.status(200).json({message:"Chat Updated Successfull...", success:true, updatedChat})
    } catch (err) {
        console.log(err.stack);
        res.status(400).json({ message: err.stack, success: false });
    }
};

const addToGroup = async (req, res) => {
    const { user, chatId } = req.body;

    if (!chatId || !user) {
        return res
            .status(400)
            .json({ message: 'User and chatId required to add in group!!', success: false });
    }

    try {
        const added = await Chat.findByIdAndUpdate(
            chatId,
            { $push: { users: user } },
            { new: true }
        )
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        if (!added) {
            return res.status(404).json({ message: 'Chat not found', success: false });
        }

        res.status(200).json(added);
    } catch (err) {
        return res.status(400).json({ message: err.message, success: false });
    }
};
const removeFromGroup = async (req, res) => {
    const { user, chatId } = req.body;
    // user means userId
    if (!chatId || !user) {
        return res
            .status(400)
            .json({ message: 'User and chatId required to add in group!!', success: false });
    }

    try {
        const removed = await Chat.findByIdAndUpdate(
            chatId,
            { $pull: { users: user } },
            { new: true }
        )
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        if (!removed) {
            return res.status(404).json({ message: 'Chat not found', success: false });
        }

        res.status(200).json(removed);
    } catch (err) {
        return res.status(400).json({ message: err.message, success: false });
    }
};
module.exports = { accessChat, fetchChats, createGroup, renameGroup, addToGroup, removeFromGroup };
