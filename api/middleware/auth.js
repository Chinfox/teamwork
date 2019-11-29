const { verifyToken } = require('../lib/tokenManager');

// eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const decodedToken = verifyToken();
    const { userId, isAdmin } = decodedToken;
    console.log(decodedToken);

    if (req.body.userId && req.body.userId !== userId) {
      res.status(403);
      return res.json({
        status: 'error',
        error: 'Invalid user ID',
      });
    }
    req.body.userId = userId;
    req.body.isAdmin = isAdmin;
    return next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      error: `Invalid request!${error}`,
    });
  }
};

module.exports = auth;
