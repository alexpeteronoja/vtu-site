class APIFeatures {
  constructor(queryModel, requestQuery, countModel, serverFilter = {}) {
    this.queryModel = queryModel;
    this.requestQuery = requestQuery;
    this.countModel = countModel;
    this.serverFilter = serverFilter;

    this.filterObj = {};
    this.page = 1;
    this.limit = 100;
  }

  filter() {
    const queryObj = { ...this.requestQuery };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((item) => delete queryObj[item]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.filterObj = JSON.parse(queryStr);

    this.queryModel = this.queryModel.find(this.filterObj);

    return this;
  }

  sorting() {
    if (this.requestQuery.sort) {
      const sortBy = this.requestQuery.sort.split(',').join(' ');

      this.queryModel = this.queryModel.sort(sortBy);
    } else {
      this.queryModel = this.queryModel.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.requestQuery.fields) {
      const fields = this.requestQuery.fields.split(',').join(' ');

      this.queryModel = this.queryModel.select(fields);
    } else {
      this.queryModel = this.queryModel.select('-__v');
    }

    return this;
  }

  pagination() {
    this.page = parseInt(this.requestQuery.page, 10) || 1;
    this.limit = Math.min(parseInt(this.requestQuery.limit, 10) || 100, 100);

    const skip = (this.page - 1) * this.limit;

    this.queryModel = this.queryModel.skip(skip).limit(this.limit);

    return this;
  }

  async getMeta() {
    const total = await this.countModel.countDocuments({
      ...this.filterObj,
      ...this.serverFilter,
    });

    const totalPages = Math.ceil(total / this.limit);

    return {
      total,
      page: this.page,
      limit: this.limit,
      totalPages,
      //   hasNextPage: this.page < totalPages,
      //   hasPreviousPage: this.page > 1,
    };
  }
}

export default APIFeatures;
