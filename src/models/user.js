import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  displayName: String,
  googleId: String,
  nickname: String,
});

export const User = mongoose.model('User', userSchema);
