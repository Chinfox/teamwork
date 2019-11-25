const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || '4000';
const userRoutes = require('./api/routes/userRoute');
const articleRoutes = require('./api/routes/articleRoute');

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);


app.use('/api/v1/users', userRoutes);
app.use('/api/v1/articles', articleRoutes);

app.use('/', (req, res) => {
  res.json({ message: 'Welcome to the Teamwork API !' });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
