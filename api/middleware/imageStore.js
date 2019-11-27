const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: 'owi',
  api_key: '139187219659792',
  api_secret: process.env.API_SECRET,
});

// eslint-disable-next-line consistent-return
const add = async (req, res, next) => {
  const file = req.files.image;


  if (file.mimetype !== 'image/gif') {
    res.status(400);
    return res.json({
      status: 'error',
      error: 'You can only upload a gif file',
    });
  }
  cloudinary.uploader.upload(file.tempFilePath)
    .then((image) => {
      console.log('imageR: ', image);
      req.image = image;
      return next();
    })
    .catch((error) => {
      console.log('errorR', error);
      res.status(500);
      return res.json({
        status: 'error',
        error: 'Gif upload failed please retry after a while',
      });
    });
};

const remove = async (req, res, next) => {
  cloudinary.uploader.destroy(req.body.publicId)
    .then((result) => {
      console.log(`image in cloud deleted: ${result}`);
      return next();
    })
    .catch((error) => {
      console.log('errorR', error);
      res.status(500);
      return res.json({
        status: 'error',
        error: 'Gif delete failed please retry after a while',
      });
    });
};

module.exports = {
  add,
  remove,
};
