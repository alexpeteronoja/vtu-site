import APIFeatures from '../../common/utils/apiFeatures.js';
import { AppError } from '../../common/utils/appError.js';
import { Wallet } from './walletModel.js';
import { WalletTransaction } from './walletTransactionModel.js';

export const createWalletService = async ({ userId, session }) => {
  const wallet = await Wallet.create(
    [
      {
        user: userId,
      },
    ],
    { session },
  );

  return { wallet };
};

export const walletdebitService = async ({
  userId,
  amount,
  session,
  transactionType,
  status,
}) => {
  const wallet = await Wallet.findOne({ user: userId }).session(
    session || null,
  );

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  if (wallet.balance < amount) {
    throw new AppError('Insufficient Funds Please Deposit Money', 400);
  }

  const balanceBefore = wallet.balance;
  wallet.balance -= amount;
  await wallet.save({ session });

  const [walletTransaction] = await WalletTransaction.create(
    [
      {
        user: userId,
        type: transactionType,
        amount,
        balanceBefore,
        balanceAfter: wallet.balance,
        status,
        paymentMethod: 'wallet',
      },
    ],
    { session },
  );

  return { walletTransaction };
};

export const walletCreditService = async ({
  userId,
  amount,
  session,
  transactionType,
  status,
}) => {
  const wallet = await Wallet.findOne({ user: userId }).session(
    session || null,
  );

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  if (amount <= 0) {
    throw new AppError('Enter a valid amount');
  }

  const balanceBefore = wallet.balance;
  wallet.balance += amount;
  await wallet.save({ session });

  const transaction = await WalletTransaction(
    [
      {
        user: userId,
        type: transactionType,
        amount,
        balanceBefore,
        balanceAfter: wallet.balance,
        status,
        paymentMethod: 'wallet',
      },
    ],
    { session },
  );

  return { wallet, transaction };
};

export const getWalletBalanceService = async ({ userId }) => {
  const wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  return { wallet };
};

export const getAllTransactionService = async ({
  userId,
  userRole,
  requestQuery,
}) => {
  let filter = {};

  if (userRole !== 'admin') {
    filter.user = userId;
  }

  const features = new APIFeatures(
    WalletTransaction.find(filter),
    requestQuery,
    WalletTransaction,
    filter,
  )
    .filter()
    .sorting()
    .limitFields()
    .pagination();

  const transactions = await features.queryModel;

  let meta = await features.getMeta();

  return { transactions, meta };
};
