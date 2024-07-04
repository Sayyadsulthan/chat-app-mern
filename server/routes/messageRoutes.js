const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

const { sendMessage, allMessages } = require('../controllers/messageController');

// protected middleware uses to protect the route
router.route('/').post(protect, sendMessage);
router.route('/:chatId').get(protect, allMessages);

module.exports = router;
