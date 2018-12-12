import '@babel/polyfill';
import '../src/utils/dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import JWT from 'jsonwebtoken';
// import { should } from 'should-http';
import { server } from '../src/app';
import { User, Board, Column } from '../src/models';

chai.use(chaiAsPromised);

const { expect } = chai;

chai.use(chaiHttp);


describe('Column', () => {
  describe('/GET column', () => {
    const user = new User({
      displayName: 'Zalupa',
      googleId: 'kalsndlk123lk',
      nickname: 'piska',
    });
    user.save();

    const board = new Board({
      authorId: user._id,
      columns: [],
    });
    board.save();

    const column = new Column({
      name: 'BOY',
      authorId: board._id,
      tasks: [],
    });
    column.save();
    const testToken = JWT.sign({
      mongoId: user._id,
    }, process.env.JWT_SECRET);
    board.columns.push(column);

    it('it should GET сolumn', (done) => {
      chai.request(server)
        .get(`/api/column?id=${board._id}`)
        .set('authorization', testToken)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          done();
        });
    });
  });

  describe('/POST column', () => {
    const user = new User({
      displayName: 'Zalupa',
      googleId: 'kalsndlk123l;k',
      nickname: 'piska',
    });
    user.save();
    const board = new Board({
      authorId: user._id,
      columns: [],
    });
    board.save();
    const testToken = JWT.sign({
      mongoId: user._id,
    }, process.env.JWT_SECRET);
    it('it should POST a column ', (done) => {
      chai.request(server)
        .post('/api/column/')
        .set('authorization', testToken)
        .send({
          name: 'BOY', boardId: board._id,
        })
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.name).to.be.equal('BOY');
          expect(res.body.authorId).to.be.equal(user._id.toString());
          done();
        });
    });
  });

  describe('/PUT/:id column', () => {
    const user = new User({
      displayName: 'Zalupa',
      googleId: 'kalsndlk123l;k',
      nickname: 'piska',
    });
    user.save();
    const board = new Board({
      authorId: user._id,
      columns: [],
    });
    board.save();
    const testToken = JWT.sign({
      mongoId: user._id,
    }, process.env.JWT_SECRET);
    const column = new Column({
      name: 'BOY',
      authorId: user._id,
      tasks: [],
    });
    column.save();
    board.columns.push(column);
    it('it should UPDATE a column given the id', (done) => {
      chai.request(server)
        .put('/api/column/')
        .set('authorization', testToken)
        .send({
          id: column._id,
          name: 'ARRA',
        })
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.name).to.be.equal('ARRA');
          done();
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
      nickname: 'piska',
    });
    user.save();
    const board = new Board({
      authorId: user._id,
      columns: [],
    });
    board.save();
    const testToken = JWT.sign({
      mongoId: user._id,
    }, process.env.JWT_SECRET);
    const column = new Column({
      name: 'ARRA',
      authorId: user._id,
      tasks: [],
    });
    column.save();
    board.columns.push(column);
    it('it should DELETE a column given the id', (done) => {
      chai.request(server)
        .delete('/api/column/')
        .set('authorization', testToken)
        .send({
          id: column._id,
        })
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          done();
        });
    });
  });
});
