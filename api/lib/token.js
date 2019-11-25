const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secret = process.env.SECRET_KEY;

const createToken = (user) => {
  const token = jwt.sign(
    { userId: user.userid, isAdmin: user.isadmin },
    secret,
    { expiresIn: '24h' },
  );
  return token;
};

const verifyToken = (token) => {
  const decodedToken = jwt.verify(token, secret);
  return decodedToken;
};

module.exports = {
  createToken,
  verifyToken,
};
