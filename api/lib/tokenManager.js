const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secret = process.env.SECRET_KEY || 'secret';

const createToken = (user) => {
  const token = jwt.sign(
    { userId: user.userid, isAdmin: user.isadmin },
    secret,
    { expiresIn: '24h' },
  );
  return token;
};
const verifyToken = (token) => {
  const result = jwt.verify(token, secret);
  return result;
};

module.exports = {
  createToken,
  verifyToken,
};
