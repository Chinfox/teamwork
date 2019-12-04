/* eslint-disable consistent-return */
// const pg = require('pg');
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();
let pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
} else {
  pool = new Pool({
    user: process.env.PGUSER,
    host: 'localhost',
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  });
}
const testDatabase = async () => {
  const client = await pool.connect();
  try {
  // const client = new pg.Client(pool);
    client.query('SELECT NOW() AS "theTime"', (error) => {
      if (error) {
        return console.error('error running query', error);
      }
      console.log('Database Connected');
    });
  } catch (error) {
    console.log(error);
  }
};

testDatabase();

module.exports = pool;
