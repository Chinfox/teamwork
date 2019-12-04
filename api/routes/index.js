const express = require('express');

const router = express.Router();


const gifController = require('../controllers/gifController');

const articleController = require('../controllers/articleController');

const { admin, gifAuthor, articleAuthor } = require('../middleware/authorize');
const { addCloud, removeCloud } = require('../middleware/imageStore');
const { createUser, signIn } = require('../controllers/userController');
const auth = require('../middleware/auth');


/**
 *  Authentication routes
 */

// Admin can create new employee account
router.post('/v1/auth/create-user', auth, admin, createUser);

// User (admin & employee) can sign in
router.post('/v1/auth/signin', signIn);


/**
 *  Gif routes
 */

// Get all gifs
router.get('/v1/gifs', auth, gifController.getAll);

// Create a gif
router.post('/v1/gifs', auth, addCloud, gifController.create);

// Get one gif
router.get('/v1/gifs/:id', auth, gifController.getOne);

// Delete one gif
router.delete('/v1/gifs/:id', auth, gifAuthor, removeCloud, gifController.remove);

// Comment on a gif
router.post('/v1/gifs/:id/comment', auth, gifController.makeComment);


/**
 *  Article routes
 */

// Get all articles
router.get('/v1/articles', auth, articleController.getAll);

// Create an article
router.post('/v1/articles', auth, articleController.create);

// Get one article
router.get('/v1/articles/:id', auth, articleController.getOne);

// Edit one article
router.patch('/v1/articles/:id', auth, articleAuthor, articleController.edit);

// Delete one article
router.delete('/v1/articles/:id', auth, articleAuthor, articleController.remove);

// Comment on an article
router.post('/v1/articles/:id/comment', auth, articleController.makeComment);


router.get('/', (req, res) => {
  res.json({
    message: 'Hello from the API',
  });
});

module.exports = router;
// export default router;
