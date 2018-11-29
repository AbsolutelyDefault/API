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
    Column,
    Task
} from '../src/models/column.js'

chai.use(chaiAsPromised);

const {
    expect
} = chai;

chai.use(chaiHttp);


describe('Task', () => {
    describe('/POST task', () => {
        const user = new User({
            displayName: 'Zalupa',
            googleId: 'kalsndlk123l;k',
            nickname: 'piska'
        });
        user.save();
        const testToken = JWT.sign({
            mongoId: user._id
        }, process.env.JWT_SECRET);
        const column = new Column({
            name: 'BOY',
            authorId: user._id,
            tasks: []
          });
          column.save();
        it('it should not POST a task without name', (done) => {
            const task = {
                description: 'sss',
                id: column._id,
            }
            chai.request(server)
                .post('/api/column/task')
                .set('authorization', testToken)
                .send(task)
                .end((err, res) => {
                    res.should.have.status(200);
                    // res.body.should.be.a('object');
                    // res.body.should.have.property('errors');
                    // res.body.errors.should.have.property('pages');
                    // res.body.errors.pages.should.have.property('kind').eql('required');
                    done();
                });
        });
        it('it should POST a task ', (done) => {
            const task = {
                name: 'BOY',
                description: 'ssss',
                id: column._id,
            }
            chai.request(server)
                .post('/api/column/task')
                .set('authorization', testToken)
                .send(task)
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

    describe('/PUT/:id task', () => {
        const user = new User({
            displayName: 'Zalupa',
            googleId: 'kalsndlk123l;k',
            nickname: 'piska'
        });
        user.save();
        const testToken = JWT.sign({
            mongoId: user._id
        }, process.env.JWT_SECRET);
        const column = new Column({
            name: 'BOY',
            authorId: user._id,
            tasks: []
          });
          column.save();
        it('it should UPDATE a task given the id', (done) => {
            const task = new Task({
                name: 'asdasd',
                description: 'asdas',
                id: column._id,
            })
            column.save((err, task) => {
                chai.request(server)
                    .put('/api/column/task')
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
        user.save();
        const testToken = JWT.sign({
            mongoId: user._id
        }, process.env.JWT_SECRET);
        const column = new Column({
            name: 'BOY',
            authorId: user._id,
            tasks: []
          });
          column.save();
        it('it should DELETE a task given the id', (done) => {
            const task = new Task({
                name: 'ARRA',
                description: 'sdfsdf',
                id: column._id,
            })
            column.save((err, task) => {
                chai.request(server)
                    .delete('/api/column/task')
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