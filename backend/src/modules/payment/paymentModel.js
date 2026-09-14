import mongoose from 'mongoose';
import crypto from 'crypto';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'wallet transaction must belong to a user'],
    },
    amount: {
      type: Number,
      required: [true, 'amount is required'],
    },
    reference: {
      type: String,
      // required: [true, 'reference id is required'],
      unique: true,
    },
    paymentGateway: {
      type: String,
      enum: {
        values: ['paystack'],
      },
      required: [true, 'Please select a payment gateway'],
      lowercase: true,
    }, // Paystack
    status: {
      type: String,
      enum: {
        values: [
          'pending',
          'successful',
          'failed',
          'abandoned',
          'ongoing',
          'processing',
          'queued',
          'reversed',
          'success',
        ],
        message: 'Invalid status type selected',
      },
      default: 'pending',
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

paymentSchema.pre('save', function () {
  const reference = `fund-${crypto.randomUUID()}`;
  this.reference = reference;
});

const Payment = mongoose.model('Payment', paymentSchema);

export { Payment };
