import mongoose from 'mongoose';

const { Schema } = mongoose;

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
