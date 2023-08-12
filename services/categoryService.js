const asyncHandler = require ('express-async-handler');
const slugify = require ('slugify');
const CategoryModel = require ('../models/categoryModel');
const ApiError = require ('../utils/apiError');

// @desc    Get list of categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncHandler (async (req, res) => {
  const page = res.query.page * 1 || 1;
  const limit = res.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const categories = await CategoryModel.find ({}).skip (skip).limit (limit);
  res.status (201).json ({requests: categories.length, page, data: categories});
});

// @desc    Get specific category by id
// @route   GET /api/categories/:id
// @access  Public
exports.getCategory = asyncHandler (async (req, res, next) => {
  const {id} = req.params;
  const category = await CategoryModel.findById (id);
  if (!category) {
    return next (new ApiError (`no category for this ${id}`, 404));
  }
  res.status (200).json ({data: category});
});

// @desc    Create category
// @route   POST  /api/categories
// @access  Private/Admin-Manager
exports.createCategory = asyncHandler (async (req, res, next) => {
  // Check if the name is provided and is a non-empty string
  const {name} = req.body;
  if (!name || typeof name !== 'string') {
    return res
      .status (400)
      .json ({error: 'Category name is required and must be a string.'});
  }
  // Create a category and save it to the database
  const category = await CategoryModel.create ({name, slug: slugify (name)});
  res.status (201).json ({data: category});
});

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
exports.updateCategory = asyncHandler (async (req, res, next) => {
  const {id} = req.params;
  const {name} = req.body;

  const category = await CategoryModel.findOneAndUpdate (
    {_id: id},
    {name, slug: slugify (name)},
    {new: true}
  );

  if (!category) {
    return next (new ApiError (`no category for this ${id}`, 404));
  }
  res.status (200).json ({data: category});
});

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteCategory = asyncHandler (async (req, res, next) => {
  const {id} = req.params;
  const category = await CategoryModel.findByIdAndDelete (id);
  if (!category) {
    return next (new ApiError (`no category for this ${id}`, 404));
  }
  res.status (204).send ();
});
