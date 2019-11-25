const express = require('express');

const router = express.Router();

const articleController = require('../controllers/articleController');

router.post('/', articleController.create);

module.exports = router;
