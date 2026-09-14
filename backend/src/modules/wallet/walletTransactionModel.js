import mongoose from 'mongoose';
import crypto from 'crypto';

const walletTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'wallet transaction must belong to a user'],
    },
    type: {
      type: String,
      enum: {
        values: ['funding', 'airtime_purchase', 'data_purchase', 'refunded'],
        message: 'Invalid Transaction Type Selected',
      },
      lowercase: true,
      required: [true, 'Transaction type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Please enter transaction amount'],
      min: 0,
    },

    balanceBefore: {
      type: Number,
      required: [true, 'Please enter balance Before'],
    },
    balanceAfter: {
      type: Number,
      required: [true, 'Please enter balance After'],
    },
    reference: {
      type: String,
      // required: [true, 'reference id is required'],
      unique: true,
    },
    status: {
      type: String,
      enum: {
        values: [
          'pending',
          'successful',
          'failed',
          'refunded',
          'admin_adjustment',
        ],
        message: 'Invalid status type selected',
      },
      lowercase: true,
      default: 'pending',
      required: [true, 'Please select a status type'],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['paystack', 'flutterwave', 'wallet'],
        message: 'Invalid payment method selected',
      },
      required: [true, 'Please select a payment method'],
    },
    description: String,
  },
  { timestamps: true },
);

walletTransactionSchema.pre('save', function () {
  const reference = `TRA-${crypto.randomUUID()}`;
  this.reference = reference;
});

const WalletTransaction = mongoose.model(
  'WalletTransaction',
  walletTransactionSchema,
);

export { WalletTransaction };
