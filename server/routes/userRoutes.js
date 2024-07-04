const router = require('express').Router();

const { createUser, authUser, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/register').post(createUser);
router.post('/login', authUser);
// uses token
router.get('/', protect, getAllUsers);

module.exports = router;
