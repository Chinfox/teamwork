const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

router.post('/signin', userController.signIn);
router.post('/create-user', userController.createUser);

module.exports = router;
