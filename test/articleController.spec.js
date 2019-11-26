const { expect } = require('chai');

const sinon = require('sinon');

const articleController = require('../api/controllers/articleController');
const client = require('../api/db/connector');

describe('Article', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('POST /articles', () => {
    it('should create a new article', async () => {
      const req = {
        body: {
          title: 'Beans',
          article: 'A food',
          userId: 1,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.resolve({ rows: [{ title: 'Beans', articleid: 1, createdOn: '2019-11-11' }] }));

      await articleController.create(req, res);

      // assertions for successful INSERTION
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(201);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'data');
    });

    it('should handle server error', async () => {
      const req = {
        body: {
          title: 'Rice',
          article: 'Also a food',
          userId: 12,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.reject(new Error('error')));

      await articleController.create(req, res);

      // assertions for server error
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(500);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });
  });

  describe('PATCH /articles/:id', () => {
    it('should be able to edit an article by id', async () => {
      const req = {
        params: { id: '2' },
        body: {
          title: 'Beans',
          article: 'A food',
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.resolve({ rows: [{ title: 'Beans', article: 'An edit' }] }));

      await articleController.edit(req, res);

      // assertions for successful UPDATE
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(200);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'data');
    });

    it('should handle server error', async () => {
      const req = {
        params: { id: '2' },
        body: {
          title: 'Rice',
          article: 'Also a food',
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.reject(new Error('error')));

      await articleController.edit(req, res);

      // assertions for server error
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(500);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });
  });

  describe('DELETE /articles/:id', () => {
    it('should be able to delete an article by id', async () => {
      const req = {
        params: { id: '2' },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.resolve());

      await articleController.remove(req, res);

      // assertions for successful UPDATE
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(200);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'data');
    });

    it('should handle server error', async () => {
      const req = {
        params: { id: '2' },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.reject(new Error('error')));

      await articleController.remove(req, res);

      // assertions for server error
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(500);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });
  });

  describe('POST /articles/:id/comment', () => {
    it('should comment on an article', async () => {
      const req = {
        params: { id: '2' },
        body: {
          comment: 'A good food',
          userId: 1,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.resolve({ rows: [{ comment: 'Beans is good', createdOn: '2019-11-11' }] }));
      stubDB.withArgs('SELECT title, article FROM articles WHERE (articleId = $1)', [2]).returns(Promise.resolve({ rows: [{ title: 'Beans', article: 'oh beans oh beans' }] }));

      await articleController.makeComment(req, res);

      // assertions for successful comment
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(201);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'data');
    });

    it('should handle server error', async () => {
      const req = {
        params: { id: '3' },
        body: {
          comment: 'A good food',
          userId: 12,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.reject(new Error('error')));

      await articleController.makeComment(req, res);

      // assertions for server error
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(500);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });
  });

  describe('GET /articles/:id', () => {
    it('should get an article by id', async () => {
      const req = {
        params: { id: '22' },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.withArgs('SELECT * FROM articles WHERE (articleId = $1)', [22]).returns(Promise.resolve({
        rows: [{
          articleid: 22, title: 'Beans', article: 'oh beans oh beans', createdon: '2019-12-12', authorid: 8,
        }],
      }));

      stubDB.withArgs('SELECT commentId, comment, authorId FROM comments WHERE (articleId = $1)', [22]).returns(Promise.resolve({
        rows: [{ commentid: 2, comment: 'oh beans oh beans', authorid: 3 }],
      }));

      await articleController.getOne(req, res);

      // assertions for successful GET
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(200);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'data');
    });

    it('should handle server error', async () => {
      const req = {
        params: { id: '23' },
        body: {
          title: 'Rice',
          article: 'Also a food',
          userId: 12,
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.reject(new Error('error')));

      await articleController.getOne(req, res);

      // assertions for server error
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(500);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });
  });
});
