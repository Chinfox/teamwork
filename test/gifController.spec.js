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
});
