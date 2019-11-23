const client = require('./connector');

const db = {
  queryDB(text, values) {
    try {
      return client.query(text, values);
    } catch (error) {
      return error;
    }
  },
};

module.exports = db;
