class APIFeatures {
  constructor(queryModel, queryString) {
    this.queryModel = queryModel;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (el) => `$${el}`);

    this.queryModel.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.queryModel = this.queryModel.sort(sortBy);
    } else {
      this.queryModel = this.queryModel.sort('-createdAt');
    }

    return this;
  }
  limitedFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.queryModel = this.queryModel.select(fields);
    } else {
      this.queryModel = this.queryModel.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.queryModel = this.queryModel.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
