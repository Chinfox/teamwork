const { expect } = require('chai');

const sinon = require('sinon');

const gifController = require('../api/controllers/gifController');
const client = require('../api/db/connector');

describe('Gif', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('POST /gifs', () => {
    it('should create a new gif', async () => {
      const req = {
        body: {
          title: 'Beans',
          userId: 1,
        },
        image: {
          public_id: 'cpx73eox2kyx6rsaorr6',
          secure_url: 'cloud url',
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.resolve({ rows: [{ title: 'Beans', gifid: 1, createdon: '2019-11-11' }] }));

      await gifController.create(req, res);

      // assertions for successful INSERTION
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(201);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'data');
    });

    it('should handle server error', async () => {
      const req = {
        body: {
          title: 'Beans',
          userId: 1,
        },
        image: {
          public_id: 'cpx73eox2kyx6rsaorr6',
          secure_url: 'cloud url',
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.reject(new Error('error')));

      await gifController.create(req, res);

      // assertions for server error
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(500);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });
  });

  describe('POST /gifs/:id/comment', () => {
    it('should comment on a gif post', async () => {
      const req = {
        params: { id: '2' },
        body: {
          comment: 'A good pics',
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
      stubDB.withArgs('SELECT title, article FROM articles WHERE (gifId = $1)', [2]).returns(Promise.resolve({ rows: [{ title: 'Beans', article: 'oh beans oh beans' }] }));

      await gifController.makeComment(req, res);

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

      await gifController.makeComment(req, res);

      // assertions for server error
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(500);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });
  });

  describe('GET /gifs/:id', () => {
    it('should get a gif by id', async () => {
      const req = {
        params: { id: '22' },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.withArgs('SELECT * FROM gifs WHERE (gifId = $1)', [22]).returns(Promise.resolve({
        rows: [{
          gifid: 22, title: 'Beans', imageurl: 'http://something', createdon: '2019-12-12', authorid: 10,
        }],
      }));

      stubDB.withArgs('SELECT commentId, comment, authorId FROM comments WHERE (gifId = $1)', [22]).returns(Promise.resolve({
        rows: [{ commentid: 2, comment: 'oh beans oh beans', authorid: 3 }],
      }));

      await gifController.getOne(req, res);

      // assertions for successful GET
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(200);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'data');
    });

    it('should handle server error', async () => {
      const req = {
        params: { id: '23' },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.reject(new Error('error')));

      await gifController.getOne(req, res);

      // assertions for server error
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(500);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });
  });

  describe('DELETE /gifs/:id', () => {
    it('should be able to delete a gif by id', async () => {
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

      await gifController.remove(req, res);

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

      await gifController.remove(req, res);

      // assertions for server error
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(500);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });
  });
});
