import mongoose, { Schema, Document } from 'mongoose';

export interface ITypingSession extends Document {
  userId: string;
  userName: string;
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  errorCount: number;
  mode: string;
  duration: number;
  language: string;
  difficulty: string;
  coinsEarned: number;
  xpEarned: number;
  isRewardEligible: boolean;
  flaggedForCheat: boolean;
  createdAt: Date;
}

const TypingSessionSchema: Schema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  wpm: { type: Number, required: true },
  rawWpm: { type: Number, required: true },
  cpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  errorCount: { type: Number, required: true },
  mode: { type: String, required: true },
  duration: { type: Number, required: true },
  language: { type: String, default: 'english' },
  difficulty: { type: String, default: 'medium' },
  coinsEarned: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
  isRewardEligible: { type: Boolean, default: true },
  flaggedForCheat: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.TypingSession || mongoose.model<ITypingSession>('TypingSession', TypingSessionSchema);
