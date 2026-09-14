import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, 'Full Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      validator: [validator.isEmail, 'Please Enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    password: {
      type: String,
      minLength: 8,
      required: [true, 'Please provide a password'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      minLength: 8,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Passwords are not thesame',
      },
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: 'invalid role selected',
      },
      default: 'user',
    },
    walletBalance: Number,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetVerifiedToken: String,
    passwordResetExpires: Date,
    passwordResetVerifiedExpires: Date,
  },
  { timestamps: true },
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return null;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  // set password change time

  if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Change password instance.

userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

// Reset Password Token Instance

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomInt(100000, 1000000).toString();

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 5 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);

export { User };
