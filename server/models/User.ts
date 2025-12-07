import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  id?: string;
  username: string;
  email: string;
  password: string;
  date: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
