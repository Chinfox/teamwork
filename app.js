const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || '4000';
const userController = require('./api/controllers/user.controller');

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);


app.post('/api/v1/users', userController.createUser);
app.get('/api/v1/users', userController.login);

app.use('/', (req, res) => {
  res.json({ message: 'Welcome to the Teamwork API !' });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
