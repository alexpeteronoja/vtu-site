import mongoose from 'mongoose';

const dataPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Data Plan Name is Required'],
    },
    network: {
      type: String,
      enum: {
        values: ['mtn', 'airtel', 'glo', '9mobile'],
      },
      required: [true, 'Please select a network provider'],
      lowercase: true,
    },
    planCode: {
      type: String,
      required: [true, 'Please enter plan code'],
    },
    serviceId: {
      type: String,
      required: [true, 'Please enter service Id'],
    },

    size: {
      type: String,
      required: [true, 'Data Size is Required'],
    },
    validity: {
      type: String,
      required: [true, 'Data Validity is Required'],
    },
    costPrice: {
      type: Number,
      required: [true, 'Data Cost Price is Required'],
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Data Selling Price is Required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const DataPlan = mongoose.model('DataPlan', dataPlanSchema);

export { DataPlan };
