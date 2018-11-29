import '@babel/polyfill';
import '../src/utils/dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import JWT from 'jsonwebtoken';
import { authorization } from '../src/controllers';
import { server } from '../src/app.js';
import { User } from '../src/models/user.js'
import {
  should
} from 'should-http';
import {
  userInfo
} from 'os';

import { Column } from '../src/models/column.js'
chai.use(chaiAsPromised);

const {
  expect
} = chai;

chai.use(chaiHttp);

describe('Authorization', () => {
  describe('authorization method', () => {
    it('it should call next with valid auth token', async () => {
      const spy = sinon.spy();
      const testToken = JWT.sign({
        test: '123'
      }, process.env.JWT_SECRET);
      await authorization({
        headers: {
          authorization: testToken
        }
      }, null, spy);
      expect(spy.callCount).to.be.equal(1);
    });
    it('it should should throw when called with wrong token', () => {
      const spy = sinon.spy();
      return expect(authorization({
        headers: {
          authorization: 'asfasf'
        }
      }, null, spy)).to.be.rejected;
    });
  });
});

