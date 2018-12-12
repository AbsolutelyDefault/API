import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
  color: { type: String, default: '#ffffff' },
  name: String,
  description: String,
  authorId: Schema.Types.ObjectId,
});

export const Task = mongoose.model('Task', taskSchema);
