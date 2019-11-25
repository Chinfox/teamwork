const client = require('../db/connector');

const create = async (req, res) => {
  const { title, article, authorId } = req.body;

  const date = new Date().toLocaleString();
  // const authorId = verifyToken();

  const query = {
    text: `INSERT INTO articles (title, article, createdOn, authorId)
            VALUES ($1, $2, $3, $4)
            RETURNING articleId, title, createdOn`,
    values: [title, article, date, authorId],
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

module.exports = {
  create,
};
