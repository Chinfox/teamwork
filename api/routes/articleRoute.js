const express = require('express');

const router = express.Router();

const articleController = require('../controllers/articleController');

router.post('/', articleController.create);
router.patch('/:articleId', articleController.edit);
router.delete('/:articleId', articleController.remove);

module.exports = router;
