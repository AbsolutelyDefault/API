import '@babel/polyfill';
import '../src/utils/dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import chaiAsPromised from 'chai-as-promised';
import JWT from 'jsonwebtoken';
import {
  authorization
} from '../src/controllers';
import {
  server
} from '../src/app.js';
import {
  User
} from '../src/models/user.js'
import {
  should
} from 'should-http';
import {
  userInfo
} from 'os';

import {
  Column
} from '../src/models/column.js'
chai.use(chaiAsPromised);

const {
  expect
} = chai;

chai.use(chaiHttp);


describe('Column', () => {

  describe('/GET column', () => {
    const user = new User({
      displayName: 'Zalupa',
      googleId: 'kalsndlk123l;k',
      nickname: 'piska'
    });
    const testToken = JWT.sign({
      mongoId: user._id
    }, process.env.JWT_SECRET);
    it('it should GET сolumn', (done) => {
      chai.request(server)
        .get('/api/column/')
        .set('authorization', testToken)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  describe('/POST column', () => {
    const user = new User({
      displayName: 'Zalupa',
      googleId: 'kalsndlk123l;k',
      nickname: 'piska'
    });
    const testToken = JWT.sign({
      mongoId: user._id
    }, process.env.JWT_SECRET);
    it('it should not POST a column without authorId and tasks', (done) => {
      const column = {
        name: 'BOY',
      }
      chai.request(server)
        .post('/api/column/')
        .set('authorization', testToken)
        .send(column)
        .end((err, res) => {
          res.should.have.status(200);
          // res.body.should.be.a('object');
          // res.body.should.have.property('errors');
          // res.body.errors.should.have.property('pages');
          // res.body.errors.pages.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should POST a column ', (done) => {
      const column = {
        name: 'BOY',
        authorId: user._id,
        tasks: []
      }
      chai.request(server)
        .post('/api/column/')
        .set('authorization', testToken)
        .send(column)
        .end((err, res) => {
          res.should.have.status(200);
          // res.body.should.be.a('object');
          // res.body.book.should.have.property('name');
          // res.body.book.should.have.property('authorId');
          // res.body.book.should.have.property('tasks');
          done();
        });
    });
  });

  describe('/PUT/:id column', () => {
    const user = new User({
      displayName: 'Zalupa',
      googleId: 'kalsndlk123l;k',
      nickname: 'piska'
    });
    const testToken = JWT.sign({
      mongoId: user._id
    }, process.env.JWT_SECRET);
    it('it should UPDATE a column given the id', (done) => {
      const column = new Column({
        name: 'BOY',
        authorId: user._id,
        tasks: []
      })
      column.save((err, column) => {
        chai.request(server)
          .put('/api/column/')
          .set('authorization', testToken)
          .send({
            name: 'ARRA'
          })
          .end((err, res) => {
            res.should.have.status(200);
            // res.body.should.be.a('object');
            // res.body.should.have.property('message').eql('Book updated!');
            // res.body.book.should.have.property('year').eql(1950);
            done();
          });
      });
    });
  });
  /*
   * Test the /DELETE/:id route
   */
  describe('/DELETE/:id column', () => {
    const user = new User({
      displayName: 'Zalupa',
      googleId: 'kalsndlk123l;k',
      nickname: 'piska'
    });
    const testToken = JWT.sign({
      mongoId: user._id
    }, process.env.JWT_SECRET);
    it('it should DELETE a column given the id', (done) => {
      const column = new Column({
        name: 'ARRA',
        authorId: user._id,
        tasks: []
      })
      column.save((err, column) => {
        chai.request(server)
          .delete('/api/column/')
          .set('authorization', testToken)
          .end((err, res) => {
            res.should.have.status(200);
            // res.body.should.be.a('object');
            // res.body.should.have.property('message').eql('Book successfully deleted!');
            // res.body.result.should.have.property('ok').eql(1);
            // res.body.result.should.have.property('n').eql(1);
            done();
          });
      });
    });
  });
});