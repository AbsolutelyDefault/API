import '@babel/polyfill';
import '../src/utils/dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiAsPromised from 'chai-as-promised';
import JWT from 'jsonwebtoken';
// import { should } from 'should-http';
import { server } from '../src/app';
// import { userInfo } from 'os';
import {
  User, Column, Task, Board,
} from '../src/models';

chai.use(chaiAsPromised);
const { expect } = chai;


chai.use(chaiHttp);


describe('Task', () => {
  afterEach((done) => {
    Task.remove();
    Board.remove();
    User.remove();
    Column.remove({}, () => {
      done();
    });
  });
  describe('/POST task', () => {
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
    it('it should POST a task ', (done) => {
      const task = {
        name: 'BOY',
        description: 'ssss',
        id: column._id,
      };
      chai.request(server)
        .post('/api/column/task')
        .set('authorization', testToken)
        .send(task)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          expect(res.body.name).to.be.equal('BOY');
          done();
        });
    });
  });

  describe('/PUT/:id task', () => {
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
    it('it should UPDATE a task given the id', (done) => {
      const task = new Task({
        name: 'asdasd',
        description: 'asdas',
        color: '#FFFFFF',
        id: column._id,
      });
      task.save();
      chai.request(server)
        .put('/api/column/task')
        .set('authorization', testToken)
        .send({
          id: task._id,
          name: 'ARRA',
          color: task.color.toString(),
          description: task.description.toString(),
        })
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
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
      name: 'BOY',
      authorId: user._id,
      tasks: [],
    });
    column.save();
    it('it should DELETE a task given the id', (done) => {
      const task = new Task({
        name: 'ARRA',
        description: 'sdfsdf',
        id: column._id,
      });
      task.save();
      chai.request(server)
        .delete('/api/column/task')
        .set('authorization', testToken)
        .send({
          id: task._id,
        })
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          done();
        });
    });
  });
});
