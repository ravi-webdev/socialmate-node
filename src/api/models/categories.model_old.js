const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');
const { compose, view, lensIndex, prop } = require('ramda');

/**
 * Refresh Token Schema
 * @private
 */
const CategoriesSchema = new mongoose.Schema({
  CategoryName: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  CategoryID: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  ParentCategoryID: {
    type: Array,
    required: true,
    unique: false,
    // index: true,
  },
  CategoryPosition: {
    type: Number,
    required: true,
    // index: true,
  },
});

CategoriesSchema.statics = {
  /**
   * Generate a reset token object and saves it into the database
   *
   * @param {Categories} categories
   *
   */
  async insertCategory(data) {
    console.log(data);
    try {
      const categoryResp = await this.insertMany(data);
      if (categoryResp) {
        return categoryResp;
      }
      throw new APIError({
        message: 'You do not have an account with us.',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      return error;
    }
  },

  async findLastestCategoryId() {
    try {
      const latestCatId = await this.find({}).sort({ CategoryID: -1 }).limit(1);
      if (latestCatId) {
        return { CategoryID: +(latestCatId[0].CategoryID) + 1 };
      }
      throw new APIError({
        message: 'You do not have an account with us.',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      return error;
    }
  },
  async findLastCatPosition() {
    try {
      const latestCatId = await this.find({}).sort({ CategoryPosition: -1 }).limit(1);
      if (latestCatId) {
        return { CategoryPosition: +(latestCatId[0].CategoryID) + 1 };
      }
      throw new APIError({
        message: 'You do not have an account with us.',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      return error;
    }
  },

  async findCategoryById(data) {
    try {
      const categoryById = await this.find().where({ ParentCategoryID: data.CategoryID });
      if (categoryById) {
        return categoryById;
      }
      throw new APIError({
        message: 'You do not have an account with us.',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      return error;
    }
  },

  async getAllCategories() {
    try {
      const allCategories = await this.find().sort({ CategoryID: -1 });
      // const latestCatId = compose(prop('CategoryID'), view(lensIndex(0)))(lastestCategoryId);
      if (allCategories) {
        return allCategories;
      }
      throw new APIError({
        message: 'You do not have an account with us.',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      return error;
    }
  },

  async updateCouponWithPhoneNumber({ CouponCode, UpdatedData }) {
    try {
      const coupon = await this.update({ CouponCode }, { $set: { UpdatedData } }).exec();
      if (coupon) {
        return coupon;
      }
      return false;
    } catch (error) {
      throw error;
    }
  },

};

/**
 * @typedef CategoriesModel
 */
module.exports = mongoose.model('CategoriesModel', CategoriesSchema);
// module.exports = CategoriesModel;
