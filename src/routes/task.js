import express from 'express';
import { Column, Task } from '../models';

const router = express.Router();

router.route('/')
  .post(async (req, res) => {
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
      res.send(task);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .delete(async (req, res) => {
    try {
      await Column.findOneAndUpdate({ _id: req.body.id, authorId: req.parsedToken.mongoId }, {
        $pull: { tasks: req.body.id },
      });
      await Task.findOneAndRemove({ _id: req.body.id, authorId: req.parsedToken.mongoId });
      res.end();
    } catch (err) {
      res.status(500).send(err);
    }
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
      res.end();
    } catch (err) {
      res.status(500).send(err);
    }
  });

export default router;
