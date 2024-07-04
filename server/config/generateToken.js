const jwt = require('jsonwebtoken');

const gererateToken = (id) => {
    return (token = jwt.sign({ id }, process.env.SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: '10d',
        // expiresIn: 60 * 60, //60s * 60S means 1hr
    }));
};

module.exports = gererateToken;
