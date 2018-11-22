import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
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
