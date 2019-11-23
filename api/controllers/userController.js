const bcrypt = require('bcrypt');
const db = require('../db/helper');

const userController = {
  async createUser(req, res) {
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

    db.queryDB(query.text, query.values)
      .then((data) => {
        // console.log(data);
        res.status(201);
        return res.json({
          status: 'success',
          data: data.rows,
        });
      })
      .catch((err) => {
        // console.log(err);
        res.status(500);
        return res.json({
          status: 'error',
          error: err,
        });
      });
  },
};

module.exports = userController;
