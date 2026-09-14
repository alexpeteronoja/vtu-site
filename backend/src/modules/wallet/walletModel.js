import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'wallet transaction must belong to a user'],
      unique: true,
    },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Wallet = mongoose.model('Wallet', walletSchema);

export { Wallet };
