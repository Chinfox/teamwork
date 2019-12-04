const client = require('../db/connector');

const create = async (req, res) => {
  try {
    const { title, article, userId } = req.body;

    const dateTime = new Date().toLocaleString();
    // const authorId = verifyToken();

    const query = {
      text: `INSERT INTO articles (title, article, createdOn, authorId)
              VALUES ($1, $2, $3, $4)
              RETURNING articleId, title, createdOn`,
      values: [title, article, dateTime, userId],
    };

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
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to create article. please retry after a while',
    });
  }
};

const edit = async (req, res) => {
  try {
    const { title, article } = req.body;
    const id = parseInt(req.params.id, 10);
    const dateTime = new Date().toLocaleString();

    const query = {
      text: `UPDATE articles SET title = $1, article = $2, updatedOn = $3 WHERE articleId = $4
            RETURNING title, article`,
      values: [title, article, dateTime, id],
    };

    const result = await client.query(query.text, query.values);
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
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to edit article. please retry after a while',
    });
  }
};

const remove = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const query = {
      text: 'DELETE FROM articles WHERE articleId = $1',
      values: [id],
    };

    await client.query(query.text, query.values);

    res.status(200);
    return res.json({
      status: 'success',
      data: {
        message: 'Article successfully deleted',
      },
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to delete article. please retry after a while',
    });
  }
};

const makeComment = async (req, res) => {
  try {
    const { comment, userId } = req.body;
    const id = parseInt(req.params.id, 10);
    const dateTime = new Date().toLocaleString();

    const query1 = {
      text: `INSERT INTO comments (comment, articleId, createdOn, authorId)
              VALUES ($1, $2, $3, $4)
              RETURNING comment, createdOn`,
      values: [comment, id, dateTime, userId],
    };

    const query2 = {
      text: 'SELECT title, article FROM articles WHERE (articleId = $1)',
      values: [id],
    };

    const result1 = await client.query(query1.text, query1.values);
    const result2 = await client.query(query2.text, query2.values);

    const [commentData] = result1.rows;
    const [articleData] = result2.rows;

    // Return if gif is not found
    if (result2.rowCount === 0) {
      res.status(404);
      return res.json({
        status: 'error',
        error: 'Article does not exist',
      });
    }

    res.status(201);
    return res.json({
      status: 'success',
      data: {
        message: 'Comment successfully created',
        comment: commentData.comment,
        createdOn: commentData.createdon,
        articleTitle: articleData.title,
        article: articleData.article,
      },
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to post comment. please retry after a while',
    });
  }
};

const getOne = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const query1 = {
      text: 'SELECT * FROM articles WHERE (articleId = $1)',
      values: [id],
    };
    const query2 = {
      text: 'SELECT commentId, comment, authorId FROM comments WHERE (articleId = $1)',
      values: [id],
    };

    const result1 = await client.query(query1.text, query1.values);
    const result2 = await client.query(query2.text, query2.values);

    const [article] = result1.rows;
    const comments = result2.rows;

    if (result1.rowCount === 0) {
      res.status(404);
      return res.json({
        status: 'error',
        error: 'Article does not exist',
      });
    }

    res.status(200);
    return res.json({
      status: 'success',
      data: {
        id: article.articleid,
        createdOn: article.createdon,
        title: article.title,
        article: article.article,
        authorId: article.authorid,
        comments,
      },
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to fetch article. please retry after a while',
    });
  }
};

const getAll = async (req, res) => {
  try {
    const query = {
      text: 'SELECT articleId, createdOn, title, article, authorId FROM articles ORDER BY createdOn DESC',
      values: [],
    };

    const result = await client.query(query.text, query.values);

    // Array of article data
    const articles = result.rows;

    res.status(200);
    return res.json({
      status: 'success',
      data: articles,
    });
  } catch (error) {
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to fetch all articles. please retry after a while',
    });
  }
};

module.exports = {
  create,
  edit,
  remove,
  makeComment,
  getOne,
  getAll,
};
