const client = require('../db/connector');

const admin = async (req, res, next) => {
  const { isAdmin } = req.body;

  if (!isAdmin) {
    res.status(403);
    return res.json({
      status: 'error',
      error: 'Access denied',
    });
  }
  return next();
};

const gifAuthor = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const { userId } = req.body;

  try {
    const result = await client.query('SELECT authorId, publicId FROM gifs WHERE (gifId = $1)', [id]);
    if (result.rowCount === 0) {
      res.status(404);
      return res.json({
        status: 'error',
        error: 'Gif does not exist',
      });
    }
    const [{ authorid, publicid }] = result.rows;

    if (userId !== authorid) {
      res.status(404);
      return res.json({
        status: 'error',
        error: 'You can only delete your own gifs!',
      });
    }
    req.body.publicId = publicid;
    return next();
  } catch (error) {
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Cannot perform this operation now. Please retry after a while',
    });
  }
};

const articleAuthor = async (req, res, next) => {
  const id = parseInt(req.params.id, 10);
  const { userId } = req.body;

  try {
    const result = await client.query('SELECT authorId FROM articles WHERE (articleId = $1)', [id]);
    const [{ authorid }] = result.rows;
    if (result.rowCount === 0) {
      res.status(404);
      return res.json({
        status: 'error',
        error: 'Article does not exist',
      });
    }
    if (userId !== authorid) {
      res.status(403);
      return res.json({
        status: 'error',
        error: 'You can only edit or delete your own articles!',
      });
    }
    return next();
  } catch (error) {
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Cannot perform this operation now. Please retry after a while',
    });
  }
};

module.exports = {
  admin,
  gifAuthor,
  articleAuthor,
};
