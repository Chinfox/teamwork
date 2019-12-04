const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
// const path = require('path');

const routes = require('./routes/index');

dotenv.config();

// process.NODE_ENV = 'production';
const app = express();
const port = process.env.PORT || '4000';

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.use(fileUpload({
  useTempFiles: true,
}));

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '/api')));
// }
// app.use('/api/v1', express.static(path.join(__dirname, 'api')));

app.use('/api', routes);

app.use('/', (req, res) => {
  res.json({ message: 'Welcome to the Teamwork API !' });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
