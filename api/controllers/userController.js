/* eslint-disable max-len */
const bcrypt = require('bcrypt');
const client = require('../db/connector');
const { createToken } = require('../lib/tokenManager');

const createUser = async (req, res) => {
  try {
    const {
      firstName, lastName, email, password, gender, jobRole, department, address,
    } = req.body;

    // convert email to lowercase to avoid query errors
    const userEmail = email.toLowerCase();
    // Encrypt password
    const hash = await bcrypt.hash(password, 10);
    const query = {
      text: `INSERT INTO users (firstName, lastName, email, password, gender, jobRole, department, address)
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
              RETURNING userId, isAdmin`,
      values: [firstName, lastName, userEmail, hash, gender, jobRole, department, address],
    };
    const result = await client.query(query.text, query.values);

    const [user] = result.rows;
    const newToken = createToken(user);

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
    res.status(500);
    return res.json({
      status: 'error',
      error: `Unable to create a user account: ${error.detail}`,
    });
  }
};

// eslint-disable-next-line consistent-return
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = {
      text: 'SELECT userId, password, isAdmin FROM users WHERE (email = $1)',
      values: [email],
    };

    const result = await client.query(query.text, query.values);

    // Return if email is not found
    if (result.rowCount === 0) {
      res.status(401);
      return res.json({
        status: 'error',
        error: 'User email not registered',
      });
    }
    const [user] = result.rows;
    const newToken = createToken(user);

    // Check password if user account exists
    await bcrypt.compare(password, user.password)
      .then((valid) => {
        // Password invalid
        if (!valid) {
          res.status(401);
          return res.json({
            status: 'error',
            error: 'Password not correct',
          });
        }
        // Password valid
        res.status(200);
        return res.json({
          status: 'success',
          data: {
            token: newToken,
            userId: user.userid,
          },
        });
      });
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
