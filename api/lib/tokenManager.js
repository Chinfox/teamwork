/* eslint-disable max-len */
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
const verifyToken = () => {
  const decodedToken = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlzQWRtaW4iOnRydWUsImlhdCI6MTU3NDk4MTUyNSwiZXhwIjoxNTc1MDY3OTI1fQ.CTF8as-eyx_rG1wvHuy8tkP8D-EY3-_fYhMcKRrmYAE', 'M0useT0wer');
  // const decodedToken = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyNCwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU3NDkxNDEzMywiZXhwIjoxNTc1MDAwNTMzfQ.jNIuu7FuyuNv4cOCdBMMEvrzdSPDyiVIWOG8lZa_ogY', 'M0useT0wer');
  return decodedToken;
};

module.exports = {
  createToken,
  verifyToken,
};
