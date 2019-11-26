const client = require('../db/connector');

const create = async (req, res) => {
  const { title, userId } = req.body;
  const { public_id: publicId, secure_url: imageUrl } = req.image;
  const dateTime = new Date().toLocaleString();

  const query = {
    text: `INSERT INTO gifs (title, imageUrl, createdOn, publicId, authorId)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING gifId, title, createdOn, imageUrl`,
    values: [title, imageUrl, dateTime, publicId, userId],
  };
  // console.log(query);
  try {
    const result = await client.query(query.text, query.values);
    const [data] = result.rows;

    res.status(201);
    return res.json({
      status: 'success',
      data: {
        gifId: data.gifid,
        message: 'Gif image successfully posted',
        createdOn: data.createdon,
        title,
        imageUrl,
      },
    });
  } catch (error) {
    console.log();
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to create gif. please retry after a while',
    });
  }
};

module.exports = {
  create,
};
