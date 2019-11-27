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

const makeComment = async (req, res) => {
  const { comment, userId } = req.body;
  const id = parseInt(req.params.id, 10);
  const dateTime = new Date().toLocaleString();

  const query1 = {
    text: `INSERT INTO comments (comment, gifId, createdOn, authorId)
            VALUES ($1, $2, $3, $4)
            RETURNING comment, createdOn`,
    values: [comment, id, dateTime, userId],
  };

  const query2 = {
    text: 'SELECT title FROM gifs WHERE (gifId = $1)',
    values: [id],
  };

  try {
    const result1 = await client.query(query1.text, query1.values);
    const result2 = await client.query(query2.text, query2.values);
    // const result2 = await client.query('SELECT FROM WHERE (articleId = $1)', [id]);
    // console.log(result1);
    // console.log(result2);
    const [commentData] = result1.rows;
    const [gifData] = result2.rows;

    res.status(201);
    return res.json({
      status: 'success',
      data: {
        message: 'Comment successfully created',
        createdOn: commentData.createdon,
        gifTitle: gifData.title,
        comment: commentData.comment,
      },
    });
  } catch (error) {
    console.log();
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to post comment. please retry after a while',
    });
  }
};

const getOne = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  const query1 = {
    text: 'SELECT * FROM gifs WHERE (gifId = $1)',
    values: [id],
  };
  const query2 = {
    text: 'SELECT commentId, comment, authorId FROM comments WHERE (gifId = $1)',
    values: [id],
  };

  try {
    const result1 = await client.query(query1.text, query1.values);
    const result2 = await client.query(query2.text, query2.values);

    const [gif] = result1.rows;
    const comments = result2.rows;

    res.status(200);
    return res.json({
      status: 'success',
      data: {
        id: gif.gifid,
        createdOn: gif.createdon,
        title: gif.title,
        url: gif.imageurl,
        authorId: gif.authorid,
        comments,
      },
    });
  } catch (error) {
    console.log();
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to fetch gif. please retry after a while',
    });
  }
};

module.exports = {
  create,
  makeComment,
  getOne,
};
