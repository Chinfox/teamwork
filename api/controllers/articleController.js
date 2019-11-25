const client = require('../db/connector');

const create = async (req, res) => {
  const { title, article, userId } = req.body;

  const dateTime = new Date().toLocaleString();
  // const authorId = verifyToken();

  const query = {
    text: `INSERT INTO articles (title, article, createdOn, authorId)
            VALUES ($1, $2, $3, $4)
            RETURNING articleId, title, createdOn`,
    values: [title, article, dateTime, userId],
  };

  try {
    const result = await client.query(query.text, query.values);
    // console.log(result);
    const [data] = result.rows;

    res.status(201);
    return res.json({
      status: 'success',
      data: {
        message: 'Article successfully posted',
        articleId: data.articleid,
        createdOn: data.createdon,
        title: data.title,
      },
    });
  } catch (error) {
    console.log();
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to create article. please retry after a while',
    });
  }
};

const edit = async (req, res) => {
  const { title, article } = req.body;
  const id = parseInt(req.params.articleId, 10);
  const dateTime = new Date().toLocaleString();
  // const authorId = verifyToken();

  const query = {
    text: `UPDATE articles SET title = $1, article = $2, updatedOn = $3 WHERE articleId = $4
          RETURNING title, article`,
    values: [title, article, dateTime, id],
  };

  try {
    const result = await client.query(query.text, query.values);
    // console.log(result);
    const [data] = result.rows;

    res.status(200);
    return res.json({
      status: 'success',
      data: {
        message: 'Article successfully updated',
        title: data.title,
        article: data.article,
      },
    });
  } catch (error) {
    console.log();
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to edit article. please retry after a while',
    });
  }
};

const remove = async (req, res) => {
  const id = parseInt(req.params.articleId, 10);

  const query = {
    text: 'DELETE FROM articles WHERE articleId = $1',
    values: [id],
  };
  // console.log(id);
  try {
    await client.query(query.text, query.values);

    res.status(200);
    return res.json({
      status: 'success',
      data: {
        message: 'Article successfully deleted',
      },
    });
  } catch (error) {
    console.log();
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to delete article. please retry after a while',
    });
  }
};

module.exports = {
  create,
  edit,
  remove,
};
