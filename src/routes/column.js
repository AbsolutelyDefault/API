import express from 'express';
import { Column, Task, Board } from '../models';

const router = express.Router();

router.route('/')
  .post(async (req, res) => {
    try {
      const column = await new Column({
        name: req.body.name,
        authorId: req.parsedToken.mongoId,
        tasks: [],
      });
      await column.save();
      let board = await Board.findOne({ authorId: req.parsedToken.mongoId });
      if (!board) {
        board = new Board({
          authorId: req.parsedToken.mongoId,
          columns: [],
        });
      }
      board.columns.push(column);
      await board.save();
      res.status(200).send(column);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .get(async (req, res) => {
    try {
      const board = await Board.findOne({ authorId: req.parsedToken.mongoId }).populate({ path: 'columns', populate: { path: 'tasks' } });
      res.send(board.columns);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .put(async (req, res) => {
    try {
      const column = await Column.findByIdAndUpdate(req.body.id, { name: req.body.name });
      res.send(column);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      await Board.findOneAndUpdate({ authorId: req.parsedToken.mongoId }, {
        $pull: { columns: req.body.id },
      });
      await Column.findByIdAndRemove(req.body.id);
      res.end();
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .patch(async (req, res) => {
    try {
      const column = await Column.findById(req.body.id);
      await Board.findAndUpdate({ authorId: req.parsedToken.mongoId }, {
        $pull: { columns: req.body.id },
        $push: {
          columns: {
            $each: [column],
            $position: req.body.num,
          },
        },
      });
      res.end();
    } catch (err) {
      res.status(500).send(err);
    }
  });


router.route('/task')
  .post(async (req, res) => {
    try {
      const task = new Task({
        name: req.body.name,
        description: req.body.description,
      });
      await task.save();
      const column = await Column.findById(req.body.id);
      column.tasks.push(task);
      await column.save();
      res.send(task);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      await Column.findByIdAndUpdate(req.body.columnId, {
        $pull: { tasks: req.body.id },
      });
      await Task.findByIdAndRemove(req.body.id);
      res.end();
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .put(async (req, res) => {
    try {
      await Task.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        description: req.body.description,
      });
      res.end();
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .patch(async (req, res) => {
    try {
      await Column.findByIdAndUpdate(req.body.columnId, {
        $pull: { tasks: req.body.id },
      });
      const task = await Task.findById(req.body.id);
      const column = await Column.findByIdAndUpdate(req.body.columnNewId, {
        $push: {
          tasks: {
            $each: [task],
            $position: req.body.num,
          },
        },
      });
      await column.save();
      res.end();
    } catch (err) {
      res.status(500).send(err);
    }
  });

export default router;
