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
  try {
    const { image } = req.files;

    // Image not uploaded
    if (!image) {
      res.status(400);
      return res.json({
        status: 'error',
        error: 'No image found!',
      });
    }

    if (image.mimetype !== 'image/gif') {
      res.status(400);
      return res.json({
        status: 'error',
        error: 'You can only upload a gif file',
      });
    }

    const imageData = await cloudinary.uploader.upload(image.tempFilePath);
    req.image = imageData;
    return next();
  } catch (error) {
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Gif upload failed please retry after a while',
    });
  }
};

const removeCloud = async (req, res, next) => {
  try {
    const { publicId } = req.body;
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`image in cloud deleted: ${result}`);
    return next();
  } catch (error) {
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Gif delete failed please retry after a while',
    });
  }
};

module.exports = {
  addCloud,
  removeCloud,
};
