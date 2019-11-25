const { expect } = require('chai');

const sinon = require('sinon');

const articleController = require('../api/controllers/articleController');
const client = require('../api/db/connector');

describe('User', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('POST /articles', () => {
    it('shoul create a new article', async () => {
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

  describe('PATCH /articles', () => {
    it('Article author should be able to edit an article', async () => {
      const req = {
        params: { articleId: '2' },
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
        params: { articleId: '2' },
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

  describe('PATCH /articles', () => {
    it('Article author should be able to edit an article', async () => {
      const req = {
        params: { articleId: '2' },
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
        params: { articleId: '2' },
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
});
