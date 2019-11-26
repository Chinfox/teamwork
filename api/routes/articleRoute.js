const express = require('express');

const router = express.Router();

const articleController = require('../controllers/articleController');

router.post('/', articleController.create);
router.get('/:id', articleController.getOne);
router.patch('/:id', articleController.edit);
router.delete('/:id', articleController.remove);
router.post('/:id/comment', articleController.makeComment);

module.exports = router;
