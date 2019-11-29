const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: 'owi',
  api_key: '139187219659792',
  api_secret: process.env.API_SECRET,
});

// eslint-disable-next-line consistent-return
const addCloud = async (req, res, next) => {
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
      req.image = image;
      return next();
    })
    .catch(() => {
      res.status(500);
      return res.json({
        status: 'error',
        error: 'Gif upload failed please retry after a while',
      });
    });
};

const removeCloud = async (req, res, next) => {
  const { publicId } = req.body;
  cloudinary.uploader.destroy(publicId)
    .then((result) => {
      console.log(`image in cloud deleted: ${result}`);
      return next();
    })
    .catch(() => {
      res.status(500);
      return res.json({
        status: 'error',
        error: 'Gif delete failed please retry after a while',
      });
    });
};

module.exports = {
  addCloud,
  removeCloud,
};
