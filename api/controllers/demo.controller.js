const getIndexPage = async (req, res) => {
  if (req.body === 'hello') {
    res.status(500);
    res.json({
      status: 'success',
    });
  }
  res.status(200);
  return res.send('Hey');
};

module.exports = { getIndexPage };
