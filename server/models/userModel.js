const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userModel = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        pic: {
            type: String,
            default: 'https://cdn-icons-png.flaticon.com/128/149/149071.png',
        },
    },
    { timestamps: true }
);

// custom method to match password
userModel.methods.matchPassword = async function (enteredPassword) {
    enteredPassword =
        typeof enteredPassword === 'string' ? enteredPassword : enteredPassword.toString();
    // console.log(enteredPassword);
    // console.log(this.password);
    // console.log(await bcrypt.compare(enteredPassword, this.password));
    return await bcrypt.compare(enteredPassword, this.password);
};

// encrypts the password before saving
userModel.pre('save', async function (next) {
    // check if the data is not modified
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userModel);

module.exports = User;
