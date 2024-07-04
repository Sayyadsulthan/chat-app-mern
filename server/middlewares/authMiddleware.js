const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = await User.findById(decoded.id);

            return next();
        } catch (err) {
            console.log(err.stack);
            return res
                .status(401)
                .json({ message: 'Not Authorized,  token failed', success: false });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not Authorized, no token', success: false });
    }
};

module.exports = { protect };
