const mongoose = require('mongoose');
require('dotenv').config();

const connectToDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_URL);

        console.log('Database connection successfull ... \nhost: ', connection.connection.host);
    } catch (err) {
        console.log('Error connecting to DB:', err.stack);
    }
};

module.exports = connectToDB;
