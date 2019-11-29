const express = require('express');

const router = express.Router();

const {
  getOne,
  getAll,
  makeComment,
  create,
  edit,
  remove,
} = require('../controllers/articleController');

const auth = require('../middleware/auth');
const { articleAuthor } = require('../middleware/authorize');

router.get('/', auth, getAll);
router.post('/', auth, create);
router.get('/:id', auth, getOne);
router.patch('/:id', auth, articleAuthor, edit);
router.delete('/:id', auth, articleAuthor, remove);
router.post('/:id/comment', auth, makeComment);

module.exports = router;
