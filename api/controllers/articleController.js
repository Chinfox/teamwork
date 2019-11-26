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
  const id = parseInt(req.params.id, 10);
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
  const id = parseInt(req.params.id, 10);

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

const makeComment = async (req, res) => {
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

  try {
    const result1 = await client.query(query1.text, query1.values);
    const result2 = await client.query(query2.text, query2.values);
    // const result2 = await client.query('SELECT FROM WHERE (articleId = $1)', [id]);
    // console.log(result1);
    // console.log(result2);
    const [commentData] = result1.rows;
    const [articleData] = result2.rows;

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
    console.log();
    res.status(500);
    return res.json({
      status: 'error',
      error: 'Unable to post comment. please retry after a while',
    });
  }
};


// const getOne = async (req, res) => {
//   const id = parseInt(req.params.id, 10);

//   const query1 = {
//     text: 'SELECT * FROM articles WHERE id = $1',
//     values: [id],
//   };
//   const query2 = {
//     text: 'SELECT * FROM comments WHERE articleId = $1',
//     values: [id],
//   };

//   try {
//     const article = await client.query(query1.text, query1.values);
//     const comments = await client.query(query2.text, query2.values);

//     // console.log(result);
//     const [data] = result.rows;

//     res.status(201);
//     return res.json({
//       status: 'success',
//       data: {
//         message: 'Article successfully posted',
//         articleId: data.articleid,
//         createdOn: data.createdon,
//         title: data.title,
//       },
//     });
//   } catch (error) {
//     console.log();
//     res.status(500);
//     return res.json({
//       status: 'error',
//       error: 'Unable to fetch article. please retry after a while',
//     });
//   }
// };

module.exports = {
  create,
  edit,
  remove,
  makeComment,
};
