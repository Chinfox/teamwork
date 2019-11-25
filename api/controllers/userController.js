const bcrypt = require('bcrypt');
const client = require('../db/connector');
const { createToken } = require('../lib/token');

const createUser = async (req, res) => {
  const {
    firstName, lastName, email, password, gender, jobRole, department, address,
  } = req.body;

  // convert email to lowercase to avoid query errors
  const userEmail = email.toLowerCase();

  // encrypt password
  const hash = await bcrypt.hash(password, 10);

  const query = {
    text: `INSERT INTO users (firstName, lastName, email, password, gender, jobRole, department, address)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING userId, isAdmin`,
    values: [firstName, lastName, userEmail, hash, gender, jobRole, department, address],
  };

  try {
    const result = await client.query(query.text, query.values);
    // console.log(result);
    const [user] = result.rows;
    const newToken = createToken(user);
    // const decodedToken = verifyToken(newToken);

    res.status(201);
    return res.json({
      status: 'success',
      data: {
        message: 'User account successfully created',
        token: newToken,
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

const signIn = async (req, res) => {
  const { email, password } = req.body;
  const query = {
    text: 'SELECT userId, password, isAdmin FROM users WHERE (email = $1)',
    values: [email],
  };

  try {
    const result = await client.query(query.text, query.values);

    // return if email is not found
    if (result.rowCount === 0) {
      res.status(401);
      return res.json({
        status: 'error',
        error: 'User email not registered',
      });
    }

    const [user] = result.rows;
    const isPassword = await bcrypt.compare(password, user.password);
    const newToken = createToken(user);

    // return if password invalid
    if (!isPassword && result.rowCount === 1) {
      res.status(401);
      return res.json({
        status: 'error',
        error: 'Password incorrect',
      });
    }

    // if (isPassword && result.rowCount === 1) {
    res.status(200);
    return res.json({
      status: 'success',
      data: {
        token: newToken,
        userId: user.userid,
      },
    });
    // }
  } catch (error) {
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Signin not successful. Please retry after a while',
    });
  }
};

module.exports = {
  createUser,
  signIn,
};
