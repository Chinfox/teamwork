const express = require('express');

const router = express.Router();

const gifController = require('../controllers/gifController');
const { add } = require('../middleware/imageStore');

router.post('/', add, gifController.create);
router.post('/:id/comment', gifController.makeComment);

module.exports = router;