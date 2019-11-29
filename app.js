const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || '4000';
const userRoutes = require('./api/routes/userRoute');
const articleRoutes = require('./api/routes/articleRoute');
const gifRoutes = require('./api/routes/gifRoute');

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

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/articles', articleRoutes);
app.use('/api/v1/gifs', gifRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use('/', (req, res) => {
  res.json({ message: 'Welcome to the Teamwork API !' });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
