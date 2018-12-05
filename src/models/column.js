import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
  color: { type: String, default: '#ffffff' },
  name: String,
  description: String,
});

export const Task = mongoose.model('Task', taskSchema);

const columnSchema = new Schema({
  name: String,
  authorId: Schema.Types.ObjectId,
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
});

export const Column = mongoose.model('Column', columnSchema);

const boardSchema = new Schema({
  authorId: Schema.Types.ObjectId,
  columns: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column',
    },
  ],
});

export const Board = mongoose.model('Board', boardSchema);
