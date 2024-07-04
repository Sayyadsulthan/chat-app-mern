const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { createServer } = require('node:http');
const { Server } = require('socket.io');

const connectDB = require('./config/db.js');
const userRoutes = require('./routes/userRoutes.js');
const chatRoutes = require('./routes/chatRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware.js');
connectDB();

const app = express();
const port = process.env.PORT || 8000;
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL } });

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Hey welcome to chat Server...');
});
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);

app.use(notFound);
app.use(errorHandler);

httpServer.listen(port, () => console.log('Server is running on port : ', port));

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('setup', (userData) => {
        // creating a socket room connection join to user_id
        // console.log('User joined to room!! ' + userData._id);
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        // creating the
        socket.join(room);
        console.log('User joined to room!! ' + room);
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', (newMessageReceived) => {
        // console.log(newMessageReceived);
        // console.log('coming messages');
        var chat = newMessageReceived.chat;
        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach((user) => {
            if (user._id === newMessageReceived.sender._id) return;
            // passing the message to all the users present in the room
            socket.in(user._id).emit('message received', newMessageReceived);
        });
    });

    socket.off('setup', (userData) => {
        socket.leave(userData._id);
        console.log('leaved from room: ', userData._id);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
