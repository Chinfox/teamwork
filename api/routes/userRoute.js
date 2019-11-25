const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

router.post('/auth/signin', userController.signIn);
router.post('/auth/create-user', userController.createUser);

module.exports = router;
