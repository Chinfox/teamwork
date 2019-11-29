const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { admin } = require('../middleware/authorize');

router.post('/signin', userController.signIn);
router.post('/create-user', auth, admin, userController.createUser);

module.exports = router;
