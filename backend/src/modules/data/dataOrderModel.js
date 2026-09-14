import mongoose from 'mongoose';
import { generateVTPassReference } from '../../common/utils/generateReference.js';

const dataOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'wallet transaction must belong to a user'],
    },
    planName: {
      type: String,
      required: [true, 'Please Insert a Plan Name'],
    },
    network: {
      type: String,
      enum: {
        values: ['mtn', 'airtel', 'glo', '9mobile'],
      },
      lowercase: true,
      required: [true, 'Please select a network provider'],
    },
    dataPlan: {
      type: mongoose.Schema.ObjectId,
      ref: 'DataPlan',
      required: [true, 'Please Insert a Data Plan'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone Number is Required'],
    },
    amountCharged: {
      type: Number,
      required: [true, 'Amount is Required'],
    },
    reference: {
      type: String,
      // required: [true, 'reference id is required'],
      unique: true,
    },
    planCode: {
      type: String,
      required: [true, 'Please enter plan code'],
    },
    providerReference: String,
    status: {
      type: String,
      enum: {
        values: ['pending', 'successful', 'failed', 'refunded'],
        message: 'Invalid status type selected',
      },
      lowercase: true,
      default: 'pending',
    },
    providerUsed: String,
    providerResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

dataOrderSchema.pre('save', function () {
  this.reference = generateVTPassReference();
});

const DataOrder = mongoose.model('DataOrder', dataOrderSchema);

export { DataOrder };
