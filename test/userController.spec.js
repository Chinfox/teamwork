const { expect } = require('chai');

const sinon = require('sinon');

// const bcrypt = require('bcrypt');

const userController = require('../api/controllers/userController');
const client = require('../api/db/connector');

describe('User', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('POST /auth/create-user', () => {
    it('only admin should be able to create a user account', async () => {
      const req = {
        body: {
          email: 'fn@gmail',
          password: '9023DDD',
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.resolve({ rows: [{ userid: 183, isAdmin: false }] }));

      await userController.createUser(req, res);

      // assertions for successful INSERTION
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(201);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'data');
    });

    it('should handle server error', async () => {
      const req = {
        body: {
          email: 'fn@gmail',
          password: '9023DDD',
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and server response
      const stubDB = sinon.stub(client, 'query');
      // stubDB.yields(Error, null);
      stubDB.returns(Promise.reject(new Error('error')));

      await userController.createUser(req, res);

      // assertions for server error
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(500);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });
  });
});
