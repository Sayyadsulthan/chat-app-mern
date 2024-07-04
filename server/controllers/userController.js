const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const { use } = require('../routes/userRoutes');

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, pic } = req.body;
        // for the confirm password we can put validation in frontend
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'name, email and password Required !!!',
                success: false,
            });
        }

        const userExist = await User.findOne({ email }).select('-password');

        if (userExist)
            return res.status(409).json({ message: 'User already Exists!', success: false });
        // defining data which has all the data
        const data = { name, email, password };

        if (pic) data.pic = pic;
        const createdUser = await User.create(data);

        const token = generateToken(createdUser._id);

        res.status(201).json({
            message: 'Registration successfull...',
            success: true,
            token,
        });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ message: err.stack, success: false });
    }
};

const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            return res.status(200).json({
                message: 'Login Successfull...',
                success: true,
                data: {
                    _id: user._id,
                    email: user.email,
                    pic: user.pic,
                    name: user.name,
                    token: generateToken(user._id),
                },
            });
        }

        res.status(400).json({ message: 'Invalid password or email..', success: false });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ message: err.stack, success: false });
    }
};
const getAllUsers = async (req, res) => {
    try {
        // this  or operator will find the users either from onr field
        // regex operatoe is LIKE operator in SQL for pattern matching
        // this will find all the users from db who has search text
        let keyword = req.query.search
            ? {
                  $or: [
                      { name: { $regex: `^.*${req.query.search}.*$`, $options: 'i' } },
                      { email: { $regex: `^.*${req.query.search}.*$`, $options: 'i' } },
                  ],
              }
            : {};

        // const users = await User.find({
        //     $or: [
        //         { name: { $regex: `^.*${req.query.search}.*$`, $options: 'i' } },
        //         { email: { $regex: `^.*${req.query.search}.*$`, $options: 'i' } },
        //     ],
        // });

        // the $ne operator is used to not include the user from that _id
        const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

        res.status(200).json({ message: 'All users', success: true, data: users });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({ message: err.stack, success: false });
    }
};

// const createUser = async(req, res)=>{
//     try{

//     }catch(err){

//     }
// }

module.exports = { createUser, authUser, getAllUsers };
