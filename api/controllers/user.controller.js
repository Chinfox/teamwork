// const User = require('../models/user');

const bcrypt = require('bcrypt');

// const jwt = require('jsonwebtoken');

// const client = require('../db/connector');

const db = require('../db/helper');


const createUser = async (req, res) => {
  const {
    firstName, lastName, email, password, gender, jobRole, department, address,
  } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const query = {
    text: `INSERT INTO users (firstName, lastName, email, password, gender, jobRole, department, address)
           VALUES (${firstName}, ${lastName}, ${email}, ${hash}, ${gender}, ${jobRole}, ${department}, ${address})
           RETURNING userId`,
    // values: [firstName, lastName, email, hash, gender, jobRole, department, address],
  };

  // await db.queryDB(query.text, query.values)
  await db.queryDB(query.text)
    .then((data) => {
      res.status(201);
      console.log(data);
      return res.json({
        status: 'success',
        data: data.rows,
      });
    })
    .catch((err) => {
      if (err.code === '23505') {
        res.status(400);
        return res.json({
          status: 'error',
          error: 'User email already exists',
        });
      }
      res.status(500);
      return res.json({
        status: 'error',
        error: err,
      });
    });
};

// const login = async (req, res) => {
//   const query = {
//     text: 'SELECT * FROM users WHERE (id = $1)',
//     values: [2],
//   };

//   const result = await db.queryDB(query.text, query.values);
//   console.log('cont: ', result);
//   if (result.name === 'error') {
//     res.status(500);
//     return res.json({
//       status: 'error',
//       error: 'Server error, try again',
//     });
//   }
//   if (result.rowCount === 0) {
//     res.status(404);
//     return res.json({
//       status: 'error',
//       error: 'User not available',
//     });
//   }
//   res.status(201);
//   return res.json({
//     status: 'success',
//     data: result.rows,
//   });
// };

module.exports = {
  createUser,
  // login,
};
