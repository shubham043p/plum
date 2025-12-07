import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizResult extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  topic: string;
  score: number;
  totalQuestions: number;
  feedback: string;
  date: Date;
}

const QuizResultSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  feedback: { type: String },
  date: { type: Date, default: Date.now }
});

export default mongoose.model<IQuizResult>('QuizResult', QuizResultSchema);
