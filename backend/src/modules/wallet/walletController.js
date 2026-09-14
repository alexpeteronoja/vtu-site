import { catchAsync } from '../../common/utils/catchAsync.js';
import { successResponse } from '../../common/utils/response.js';
import {
  getAllTransactionService,
  getWalletBalanceService,
} from './walletService.js';

export const getWalletBalance = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();

  const { wallet } = await getWalletBalanceService({ userId });

  successResponse(res, 200, { data: { wallet } }, 'Wallet Retrieved Success');
});

export const getAllTransaction = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();
  const userRole = req.user.role;

  const { transactions, meta } = await getAllTransactionService({
    userId,
    userRole,
    requestQuery: req.query,
  });

  successResponse(
    res,
    200,
    { data: { meta, transactions } },
    'Wallet Retrieved Success',
  );
});
