import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonAsPromised from 'sinon-as-promised';
import promised from 'chai-as-promised';
import mongoose from 'mongoose';
import * as authenticationController from '../../../server/controllers/users/users.authentication.server.controller';
import jwtToken from '../../../server/authentication/jwtToken';
import userModel from '../../../server/models/users.server.model.user';


chai.use(promised);
chai.use(sinonChai);

let expect = chai.expect;
let should = chai.should();

describe('/modules/users/server/controllers/users/users.authentication.server.controller.js', () => {

  beforeEach(() => {
    return userModel.init();
  });

  describe('export', () => {

    it('should export default', () => {
      return authenticationController.default.should.be.an.object;
    });

    it('should export signin', () => {
      return authenticationController.signin.should.be.a.function;
    });

    describe('signin()', () => {
      let mockReq, mockRes, mockUser, mockAuth, user, model;

      beforeEach(() => {
        model = mongoose.model('User');
        user = new model();
        mockReq = {
          user: user,
        };
        mockRes = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis()
        };
      });


      describe('success', () => {

        beforeEach(() => {
          return authenticationController.signin(mockReq, mockRes);
        });

        it('should call res.json with a user and token', () => {
          expect(mockRes.json.args[0][0].token).to.exist;
          expect(mockRes.json.args[0][0].user).to.equal(user);
        });

      });

      describe('error', () => {

        beforeEach(() => {
          mockAuth = sinon.stub(jwtToken, 'signToken').rejects('Error!');
          return authenticationController.signin(mockReq, mockRes);
        });

        afterEach(() => {
          mockAuth.restore();
        });

        it('should call respond with status 400', () => {
          mockRes.status.should.have.been.calledWith(400);
        });

        it('should call respond Error', () => {
          mockRes.json.should.have.been.calledWith('Error!');
        });

      });

    });

    it('should export signup', () => {
      return authenticationController.signup.should.be.a.function;
    });

    describe('signup()', () => {
      let mockReq, mockRes, mockUser, mockAuth, user, model;

      beforeEach(() => {
        model = mongoose.model('User');
        user = new model();

        mockReq = {
          user: user
        };

        mockRes = {
          json: sinon.spy(),
          status: sinon.stub().returnsThis()
        };
      });


      describe('success', () => {

        beforeEach(() => {
          mockUser = sinon.stub(user, 'save').resolves(user);
          return authenticationController.signup(mockReq, mockRes);
        });

        afterEach(() => {
          mockUser.restore();
        });

        it('should call res.json with a user and token', () => {
          expect(mockRes.json.args[0][0].token).to.exist;
          expect(mockRes.json.args[0][0].user).to.equal(user);
        });

        it('should not set user roles', () => {
          expect(mockRes.json.args[0][0].user.roles).to.not.contain('admin');
        });

      });

      describe('error', () => {

        beforeEach(() => {
          mockUser = sinon.stub(user, 'save').rejects('Error!');
          return authenticationController.signup(mockReq, mockRes);
        });

        afterEach(() => {
          mockUser.restore();
        });

        it('should call respond with status 400', () => {
          mockRes.status.should.have.been.calledWith(400);
        });

        it('should call respond Error', () => {
          mockRes.json.should.have.been.calledWith('Error!');
        });

      });

    });

    it('should export createUser', () => {
      return authenticationController.createUser.should.be.a.function;
    });

    describe('createUser()', () => {
      let mockReq, mockRes, mockNext;
      beforeEach(() => {
        mockReq = {
          body: {
            firstName: 'Fred',
            roles: ['admin']
          }
        };
        mockRes = {};
        mockNext = sinon.stub();
        return authenticationController.createUser(mockReq, mockRes, mockNext);
      });

      it('should create a user model on req.user', () => {
        return expect(mockReq.user).to.exist;
      });

      it('should remove the roles', () => {
        return expect(mockReq.user.roles).to.not.exist;
      });

      it('should call next', () => {
        return mockNext.should.have.been.called;
      });

    });

  });

});
