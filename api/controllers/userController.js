const bcrypt = require('bcrypt');
const client = require('../db/connector');
const { createToken, verifyToken } = require('../lib/token');

const createUser = async (req, res) => {
  const {
    firstName, lastName, email, password, gender, jobRole, department, address,
  } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const query = {
    text: `INSERT INTO users (firstName, lastName, email, password, gender, jobRole, department, address)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING userId`,
    values: [firstName, lastName, email, hash, gender, jobRole, department, address],
  };

  try {
    const result = await client.query(query.text, query.values);
    // console.log(result);
    const [user] = result.rows;
    const newToken = createToken(user);
    const decodedToken = verifyToken(newToken);

    res.status(201);
    return res.json({
      status: 'success',
      data: {
        message: 'User account successfully created',
        token: newToken,
        verify: decodedToken,
        userId: user.userid,
      },
    });
  } catch (error) {
    // console.log(error);
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to create a user account please retry after a while',
    });
  }
};

module.exports = {
  createUser,
};
