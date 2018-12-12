import express from 'express';
import { Column, Board, Task } from '../models';

const router = express.Router();

router.get('/board', async (req, res) => {
  try {
    const board = await Board.findOne({ authorId: req.parsedToken.mongoId });
    res.status(200).send(board._id);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.route('/')
  .post(async (req, res) => {
    try {
      let board = await Board.findOne({ authorId: req.parsedToken.mongoId });
      if (!board) {
        board = new Board({
          authorId: req.parsedToken.mongoId,
          columns: [],
        });
      }
      if (board._id.toString() === req.body.boardId) {
        const column = await new Column({
          name: req.body.name,
          authorId: req.parsedToken.mongoId,
          tasks: [],
        });
        await column.save();
        board.columns.push(column);
        await board.save();
        res.status(200).send(column);
      } else {
        throw new Error('No permission');
      }
    } catch (err) {
      res.status(500).send(err);
    }
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
      res.end();
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .patch(async (req, res) => {
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
      res.end();
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .get(async (req, res) => {
    try {
      let board;
      if (req.query.id) {
        board = await Board.findById(req.query.id).populate({ path: 'columns', populate: { path: 'tasks' } });
      } else {
        board = await Board.findOne({ authorId: req.parsedToken.mongoId }).populate({ path: 'columns', populate: { path: 'tasks' } });
      }
      res.send({ columns: board.columns, boardId: board._id, editable: board.authorId.toString() === req.parsedToken.mongoId });
    } catch (err) {
      res.status(500).send(err);
    }
  });

export default router;
