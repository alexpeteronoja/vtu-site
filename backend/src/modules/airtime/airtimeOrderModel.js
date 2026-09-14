import mongoose, { Schema } from 'mongoose';
import { generateVTPassReference } from '../../common/utils/generateReference.js';

const airtimeOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'wallet transaction must belong to a user'],
    },
    network: {
      type: String,
      enum: {
        values: ['mtn', 'airtel', 'glo', '9mobile'],
      },
      lowercase: true,
      required: [true, 'Please select a network provider'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone Number is Required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is Required'],
    },
    reference: {
      type: String,
      // required: [true, 'reference id is required'],
      unique: true,
    },
    providerReference: String,
    status: {
      type: String,
      enum: {
        values: ['pending', 'successful', 'failed', 'refund'],
        message: 'Invalid status type selected',
      },
      lowercase: true,
      default: 'pending',
    },
    providerUsed: String,
    providerResponse: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

airtimeOrderSchema.pre('save', function () {
  this.reference = generateVTPassReference();
});

const AirtimeOrder = mongoose.model('AirtimeOrder', airtimeOrderSchema);

export { AirtimeOrder };
