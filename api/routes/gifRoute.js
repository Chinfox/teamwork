const express = require('express');

const router = express.Router();

const gifController = require('../controllers/gifController');
const { add, remove } = require('../middleware/imageStore');

router.get('/', gifController.getAll);
router.post('/', add, gifController.create);
router.get('/:id', gifController.getOne);
router.delete('/:id', remove, gifController.remove);
router.post('/:id/comment', gifController.makeComment);

module.exports = router;
