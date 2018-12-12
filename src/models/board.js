import mongoose from 'mongoose';

const { Schema } = mongoose;

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
