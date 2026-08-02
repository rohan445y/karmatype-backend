import mongoose, { Schema, Document } from 'mongoose';

export interface IWithdrawal extends Document {
  userId: string;
  userName: string;
  userEmail: string;
  method: 'esewa' | 'khalti' | 'bank';
  accountDetails: string;
  amountNpr: number;
  coinsDeducted: number;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  transactionRef?: string;
  createdAt: Date;
  processedAt?: Date;
}

const WithdrawalSchema: Schema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  method: { type: String, enum: ['esewa', 'khalti', 'bank'], required: true },
  accountDetails: { type: String, required: true },
  amountNpr: { type: Number, required: true },
  coinsDeducted: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNote: { type: String },
  transactionRef: { type: String },
  createdAt: { type: Date, default: Date.now },
  processedAt: { type: Date }
});

export default mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal', WithdrawalSchema);
