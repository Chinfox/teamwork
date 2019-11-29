const express = require('express');

const router = express.Router();

const {
  create,
  remove,
  getOne,
  getAll,
  makeComment,
} = require('../controllers/gifController');

const { addCloud, removeCloud } = require('../middleware/imageStore');
const { gifAuthor } = require('../middleware/authorize');
const auth = require('../middleware/auth');

router.get('/', auth, getAll);
router.post('/', auth, addCloud, create);
router.get('/:id', auth, getOne);
router.delete('/:id', auth, gifAuthor, removeCloud, remove);
router.post('/:id/comment', auth, makeComment);

module.exports = router;
