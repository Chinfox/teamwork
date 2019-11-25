const { expect } = require('chai');

const sinon = require('sinon');

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
      stubDB.returns(Promise.resolve({ rows: [{ userid: 183, isadmin: false }] }));

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
      stubDB.returns(Promise.reject(new Error('error')));

      await userController.createUser(req, res);

      // assertions for server error
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(500);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });
  });

  describe('POST /auth/signin', () => {
    it('should allow registered user sign in', async () => {
      const req = {
        body: {
          email: 'goodEmail@gmail',
          password: '1234',
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and a part of server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.resolve({
        rowCount: 1,
        rows: [{ userid: 183, isadmin: false, password: '$2b$10$/JkIawP50ZQdrNNP.k31kuOs7LPWwh1PD0N9MhtfoHi0ha8inlMyC' }],
      }));

      await userController.signIn(req, res);

      // assertions for successful login
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(200);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'data');
    });

    it('should not allow user signin with unregistered email', async () => {
      const req = {
        body: {
          email: 'wrongEmail@gmail',
          password: 'wordWrap',
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      // create a stub to fake the query and a part of server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.resolve({ rowCount: 0, rows: [{ password: '9023DDD' }] }));

      await userController.signIn(req, res);

      // assertions for unregistered user email
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(401);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });

    it('should not allow user signin with wrong password', async () => {
      const req = {
        body: {
          email: 'fn@gmail',
          password: '1234',
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and a part of server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.resolve({ rowCount: 1, rows: [{ password: '9023DDD' }] }));

      await userController.signIn(req, res);

      // assertions for bad authentication
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(401);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });

    it('should handle signIn error', async () => {
      const req = {
        body: {
          email: 'example@gmail',
          password: '9023DDD',
        },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      // create a stub to fake the query and a part of server response
      const stubDB = sinon.stub(client, 'query');
      stubDB.returns(Promise.reject(new Error('error')));

      await userController.signIn(req, res);

      // assertions for server error
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(500);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
    });
  });
});
