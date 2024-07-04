const router = require('express').Router();

const {
    accessChat,
    fetchChats,
    createGroup,
    renameGroup,
    removeFromGroup,
    addToGroup,
} = require('../controllers/chatControllers');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').post(protect, accessChat);
router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroup);
router.route('/rename').put(protect, renameGroup);
router.route('/groupadd').put(protect, addToGroup);
router.route('/groupremove').put(protect, removeFromGroup);

module.exports = router;
