import express from 'express';
import { Column, Task } from '../models';

const router = express.Router();

router.route('/')
  .post(async (req, res) => {
    const column = await new Column({
      name: req.body.name,
      authorId: req.parsedToken.mongoId,
      tasks: [],
    });
    column.save();
    res.status(200).send(column);
  })
  .get(async (req, res) => {
    const cols = await Column.find({ authorId: req.parsedToken.mongoId }).populate('tasks');
    res.send(cols);
  })
  .put(async (req, res) => {
    const column = await Column.findByIdAndUpdate(req.body.id, { name: req.body.name });
    res.send(column);
  })
  .delete(async (req, res) => {
    await Column.findByIdAndRemove(req.body.id);
    res.end();
  });
router.route('/task')
  .post(async (req, res) => {
    const task = new Task({
      name: req.body.name,
      description: req.body.description,
    });
    await task.save();
    const column = await Column.findById(req.body.id);
    column.tasks.push(task);
    await column.save();
    res.end();
  })
  .delete(async (req, res) => {
    await Column.findByIdAndUpdate(req.body.columnId, {
      $pull: { tasks: req.body.id },
    });
    await Task.findByIdAndRemove(req.body.id);
    res.end();
  })
  .put(async (req, res) => {
    await Task.findByIdAndUpdate(req.body.id, {
      name: req.body.name,
      description: req.body.description,
    });
    res.end();
  });

export default router;
