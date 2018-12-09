import express from 'express';
import { Column, Task, Board } from '../models';

const router = express.Router();

// router.get('/board', async (req, res) => {
//   try {
//     const board = await Board.findOne({ authorId: req.parsedToken.mongoId });
//     res.status(200).send(board);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

router.route('/')
  .post(async (req, res) => {
    const session = await Board.startSession();
    session.startTransaction();
    try {
      const column = await new Column({
        name: req.body.name,
        authorId: req.parsedToken.mongoId,
        tasks: [],
      });
      let board = await Board.findOne({ authorId: req.parsedToken.mongoId });
      if (!board) {
        board = new Board({
          authorId: req.parsedToken.mongoId,
          columns: [],
        });
      }
      // if (board._id === req.bode.boardId) {
      await column.save();
      board.columns.push(column);
      await board.save();
      // }
      await session.commitTransaction();
      res.status(200).send(column);
    } catch (err) {
      await session.abortTransaction();
      res.status(500).send(err);
    }
    session.endSession();
  })
  .put(async (req, res) => {
    try {
      const column = await Column.findOneAndUpdate({ _id: req.body.id, authorId: req.parsedToken.mongoId }, { name: req.body.name });
      res.send(column);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .delete(async (req, res) => {
    const session = await Board.startSession();
    session.startTransaction();
    try {
      const column = await Column.findOne({ _id: req.body.id, authorId: req.parsedToken.mongoId });
      await Board.findOneAndUpdate({ authorId: req.parsedToken.mongoId }, {
        $pull: { columns: req.body.id },
      });
      if (column.tasks) {
        column.tasks.forEach(async (i) => {
          await Task.findByIdAndRemove(i);
        });
      }
      await Column.findOneAndRemove({ _id: req.body.id, authorId: req.parsedToken.mongoId });
      await session.commitTransaction();
      res.end();
    } catch (err) {
      await session.abortTransaction();
      res.status(500).send(err);
    }
    session.endSession();
  })
  .patch(async (req, res) => {
    const session = await Board.startSession();
    session.startTransaction();
    try {
      const column = await Column.findOne({ _id: req.body.id, authorId: req.parsedToken.mongoId });
      await Board.findOneAndUpdate({ authorId: req.parsedToken.mongoId }, {
        $pull: { columns: req.body.id },
      });
      if (column) {
        await Board.findOneAndUpdate({ authorId: req.parsedToken.mongoId }, {
          $push: {
            columns: {
              $each: [column],
              $position: req.body.num,
            },
          },
        });
      }
      await session.commitTransaction();
      res.end();
    } catch (err) {
      await session.abortTransaction();
      res.status(500).send(err);
    }
    session.endSession();
  })
  .get(async (req, res) => {
    try {
      let board;
      if (req.query.id) {
        board = await Board.findById(req.query.id).populate({ path: 'columns', populate: { path: 'tasks' } });
      } else {
        board = await Board.findOne({ authorId: req.parsedToken.mongoId }).populate({ path: 'columns', populate: { path: 'tasks' } });
      }
      res.send(board.columns);
      // res.send({ columns: board.columns, id: board._id });
    } catch (err) {
      res.status(500).send(err);
    }
  });


router.route('/task')
  .post(async (req, res) => {
    const session = await Task.startSession();
    session.startTransaction();
    try {
      const task = new Task({
        name: req.body.name,
        description: req.body.description,
        authorId: req.parsedToken.mongoId,
      });
      await task.save();
      const column = await Column.findOne({ _id: req.body.id, authorId: req.parsedToken.mongoId });
      column.tasks.push(task);
      await column.save();
      await session.commitTransaction();
      res.send(task);
    } catch (err) {
      await session.abortTransaction();
      res.status(500).send(err);
    }
    session.endSession();
  })
  .delete(async (req, res) => {
    const session = await Task.startSession();
    session.startTransaction();
    try {
      await Column.findOneAndUpdate({ _id: req.body.id, authorId: req.parsedToken.mongoId }, {
        $pull: { tasks: req.body.id },
      });
      await Task.findOneAndRemove({ _id: req.body.id, authorId: req.parsedToken.mongoId });
      await session.commitTransaction();
      res.end();
    } catch (err) {
      await session.abortTransaction();
      res.status(500).send(err);
    }
    session.endSession();
  })
  .put(async (req, res) => {
    try {
      await Task.findOneAndUpdate({ _id: req.body.id, authorId: req.parsedToken.mongoId }, {
        color: req.body.color,
        name: req.body.name,
        description: req.body.description,
      });
      res.end();
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .patch(async (req, res) => {
    const session = await Task.startSession();
    session.startTransaction();
    try {
      await Column.findOneAndUpdate({ _id: req.body.columnId, authorId: req.parsedToken.mongoId }, {
        $pull: { tasks: req.body.id },
      });
      const task = await Task.findById({ _id: req.body.id, authorId: req.parsedToken.mongoId });
      await Column.findByIdAndUpdate({ _id: req.body.columnNewId, authorId: req.parsedToken.mongoId }, {
        $push: {
          tasks: {
            $each: [task],
            $position: req.body.num,
          },
        },
      });
      await session.commitTransaction();
      res.end();
    } catch (err) {
      await session.abortTransaction();
      res.status(500).send(err);
    }
    session.endSession();
  });

export default router;
