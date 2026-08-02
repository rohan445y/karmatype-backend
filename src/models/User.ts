import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'premium_user' | 'moderator' | 'admin';
  isPremium: boolean;
  premiumExpiresAt?: Date;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  referralCode: string;
  referredBy?: string;
  totalTestsCompleted: number;
  bestWpm: number;
  avgWpm: number;
  avgAccuracy: number;
  country: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'premium_user', 'moderator', 'admin'], default: 'user' },
  isPremium: { type: Boolean, default: false },
  premiumExpiresAt: { type: Date },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  streak: { type: Number, default: 1 },
  referralCode: { type: String, required: true, unique: true },
  referredBy: { type: String },
  totalTestsCompleted: { type: Number, default: 0 },
  bestWpm: { type: Number, default: 0 },
  avgWpm: { type: Number, default: 0 },
  avgAccuracy: { type: Number, default: 0 },
  country: { type: String, default: 'Nepal' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
