const { expect } = require('chai');

const sinon = require('sinon');

const userController = require('../api/controllers/user.controller');
const db = require('../api/db/helper');

describe('User', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('POST /auth/create-user', () => {
    it('only admin should be able to create a user account', async () => {
      const req = {};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      const query = {
        text: `INSERT INTO users (firstName, lastName, email, password, gender, jobRole, department, address)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        values: [firstName, lastName, email, password, gender, jobRole, department, address],
      };

      // create a stub to fake a part of server response
      const stub = sinon.stub(db, 'queryDB');
      stub.withArgs(query.text, query.values).returns(Promise.resolve({ rowCount: 1 }));
      stub.callThrough();

      // await userController.login(req, res);
      await userController.createUser(req, res);

      // assertions for successful SELECT
      expect(db.queryDB.calledOnce).to.equal(true);
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(201);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'data');
      // db.queryDB.restore();
    });

    it('should handle error for non-existent data', async () => {
      const req = {};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      const query = {
        text: `INSERT INTO users (firstName, lastName, email, password, gender, jobRole, department, address)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        values: [firstName, lastName, email, password, gender, jobRole, department, address],
      };

      const stub = sinon.stub(db, 'queryDB');
      stub.withArgs(query.text, query.values).returns(Promise.resolve({ rowCount: 0 }));
      stub.callThrough();

      // await userController.login(req, res);
      await userController.createUser(req, res);

      // assertions
      expect(db.queryDB.calledOnce).to.equal(true);
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(404);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
      // db.queryDB.restore();
    });

    it('should handle server error with relevant error message', async () => {
      const req = {};
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      const query = {
        text: `INSERT INTO users (firstName, lastName, email, password, gender, jobRole, department, address)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        values: [firstName, lastName, email, password, gender, jobRole, department, address],
      };

      const stub = sinon.stub(db, 'queryDB');
      stub.withArgs(query.text, query.values).returns(Promise.reject(new Error('error')));
      stub.callThrough();

      await userController.createUser(req, res);

      // assertions for server error
      expect(db.queryDB.calledOnce).to.equal(true);
      expect(res.status.calledOnce).to.equal(true);
      expect(res.json.calledOnce).to.equal(true);
      expect(res.status.args[0][0]).to.equal(500);
      expect(res.json.args[0][0]).to.be.an('object').that.has.all.keys('status', 'error');
      // db.queryDB.restore();
    });
  });
});
