import { catchAsync } from '../../common/utils/catchAsync.js';
import { successResponse } from '../../common/utils/response.js';
import {
  createDataPlanService,
  deleteDataService,
  getAllDataOrderService,
  getAllDataPlanService,
  getDataOrderService,
  purchaseDataService,
  updateDataPlanService,
} from './dataService.js';

export const createDataPlan = catchAsync(async (req, res, next) => {
  const {
    name,
    network,
    planCode,
    size,
    validity,
    costPrice,
    sellingPrice,
    serviceId,
  } = req.body;

  const { dataPlan } = await createDataPlanService({
    name,
    network,
    planCode,
    size,
    serviceId,
    validity,
    costPrice,
    sellingPrice,
  });

  successResponse(
    res,
    201,
    { data: { dataPlan } },
    'Data Plan Created Success',
  );
});

export const updateDataPlan = catchAsync(async (req, res, next) => {
  const dataPlanId = req.params.id;
  const { body } = req;

  const { dataPlan } = await updateDataPlanService({ dataPlanId, body });

  successResponse(
    res,
    200,
    { data: { dataPlan } },
    'Data plan updated success',
  );
});

export const getAllDataPlan = catchAsync(async (req, res, next) => {
  const requestQuery = req.query;
  const { dataPlan, meta } = await getAllDataPlanService({ requestQuery });

  successResponse(res, 200, { data: { meta, dataPlan } }, 'sucess');
});

export const deleteDataPlan = catchAsync(async (req, res, next) => {
  const dataPlanId = req.params.id;
  await deleteDataService({ dataPlanId });
  successResponse(res, 204, {}, 'user deleted');
});

export const getAllDataOrder = catchAsync(async (req, res, next) => {
  const userId = req.user._id.toString();
  const userRole = req.user.role;

  const { dataOrder, meta } = await getAllDataOrderService({
    userId,
    userRole,
    requestQuery: req.query,
  });

  successResponse(
    res,
    200,
    { data: { meta, dataOrder } },
    'Data Order Retrieved Success',
  );
});

export const getDataOrder = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const userRole = req.user.role;
  const { dataOrderId } = req.params;

  console.log(dataOrderId);

  const { dataOrder } = await getDataOrderService({
    userId,
    userRole,
    dataOrderId,
  });

  successResponse(
    res,
    200,
    { data: { dataOrder } },
    'Data Order Retrieved Success',
  );
});

export const purchaseData = catchAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { phoneNumber } = req.body;
  const { dataPlanId } = req.params;

  const { dataTxn, message } = await purchaseDataService({
    dataPlanId,
    userId,
    phoneNumber,
  });

  successResponse(res, 200, { dataTxn }, message);
});
