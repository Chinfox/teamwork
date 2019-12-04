const client = require('../db/connector');

const create = async (req, res) => {
  try {
    const { title, userId } = req.body;
    const { public_id: publicId, secure_url: imageUrl } = req.image;
    const dateTime = new Date().toLocaleString();

    const query = {
      text: `INSERT INTO gifs (title, imageUrl, createdOn, publicId, authorId)
              VALUES ($1, $2, $3, $4, $5)
              RETURNING gifId, title, createdOn, imageUrl`,
      values: [title, imageUrl, dateTime, publicId, userId],
    };

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
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to create gif. please retry after a while',
    });
  } finally {
    client.release();
  }
};

const makeComment = async (req, res) => {
  try {
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

    const result1 = await client.query(query1.text, query1.values);
    const result2 = await client.query(query2.text, query2.values);

    const [commentData] = result1.rows;
    const [gifData] = result2.rows;

    // Return if gif is not found
    if (result2.rowCount === 0) {
      res.status(404);
      return res.json({
        status: 'error',
        error: 'Gif does not exist',
      });
    }

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
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to post comment. please retry after a while',
    });
  } finally {
    client.release();
  }
};

const getOne = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const query1 = {
      text: 'SELECT * FROM gifs WHERE (gifId = $1)',
      values: [id],
    };
    const query2 = {
      text: 'SELECT commentId, comment, authorId FROM comments WHERE (gifId = $1)',
      values: [id],
    };

    const result1 = await client.query(query1.text, query1.values);
    const result2 = await client.query(query2.text, query2.values);

    const [gif] = result1.rows;
    const comments = result2.rows;

    if (result1.rowCount === 0) {
      res.status(404);
      return res.json({
        status: 'error',
        error: 'Gif does not exist',
      });
    }

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
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to fetch gif. please retry after a while',
    });
  } finally {
    client.release();
  }
};

const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const query = {
      text: 'DELETE FROM gifs WHERE gifId = $1',
      values: [id],
    };

    await client.query(query.text, query.values);

    res.status(200);
    return res.json({
      status: 'success',
      data: {
        message: 'gif post successfully deleted',
      },
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to delete gif. please retry after a while',
    });
  } finally {
    client.release();
  }
};

const getAll = async (req, res) => {
  try {
    const query = {
      text: 'SELECT gifId, createdOn, title, Imageurl, authorId FROM gifs ORDER BY createdOn DESC',
      values: [],
    };

    const result = await client.query(query.text, query.values);

    // Array of gif data
    const gifs = result.rows;

    res.status(200);
    return res.json({
      status: 'success',
      data: gifs,
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to fetch all gifs. please retry after a while',
    });
  } finally {
    client.release();
  }
};

module.exports = {
  create,
  makeComment,
  getOne,
  remove,
  getAll,
};
