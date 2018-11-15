import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  displayName: String,
  googleId: String,
  nickname: String,
});

export const User = mongoose.model('User', userSchema);
