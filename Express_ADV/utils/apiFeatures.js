class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    //Advance filtering
    let queryString = JSON.stringify(this.queryStr);
    queryString = queryString.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (match) => `$${match}`
    );
    const queryObj = JSON.parse(queryString);
    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    //Sorting
    if (this.queryStr.sort) {
      const sortedBy = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sortedBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    // Limitting Fields
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      //   console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    //Implement Pagination
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 10;
    //page 1: 1-10, page 2:11-20, page 3:21-30
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
