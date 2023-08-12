const asyncHandler = require ('express-async-handler');
const slugify = require ('slugify');
const SubCategoryModel = require ('../models/subCategoryModel');
const ApiError = require ('../utils/apiError');

exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next ();
};

// @desc    Sub Create category
// @route   POST  /api/subcategories
// @access  Private/Admin-Manager
exports.createSubCategory = asyncHandler (async (req, res) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  const {name, category} = req.body;
  // Create a category and save it to the database
  const subCategory = await SubCategoryModel.create ({
    name,
    slug: slugify (name),
    category,
  });
  res.status (201).json ({data: subCategory});
});

// Nested route
// GET /api/v1/categories/:categoryId/subcategories

exports.createFilterObj = (req, res, next ) => {
    let filterObject = {};
    if (req.params.categoryId) {
      filterObject = {category: req.params.categoryId};
    }
    req.filterObject = filterObject
    next ();
}

// @desc    Get list of sub categories
// @route   GET /api/subcategories
// @access  Public
exports.getSubCategories = asyncHandler (async (req, res) => {
  const page = res.query.page * 1 || 1;
  const limit = res.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  
  const subCategories = await SubCategoryModel.find (req.filterObject)
    .skip (skip)
    .limit (limit);
  res
    .status (201)
    .json ({requests: subCategories.length, page, data: subCategories});
});

// @desc    Get specific sub category by id
// @route   GET /api/subcategories/:id
// @access  Public
exports.getSubCategory = asyncHandler (async (req, res, next) => {
  const {id} = req.params;
  const subCategory = await SubCategoryModel.findById (id);
  if (!subCategory) {
    return next (new ApiError (`no subcategory for this ${id}`, 404));
  }
  res.status (200).json ({data: subCategory});
});

// @desc    Update specific sub category
// @route   PUT /api/v1/subcategories/:id
// @access  Private/Admin-Manager
exports.updateSubCategory = asyncHandler (async (req, res, next) => {
  const {id} = req.params;
  const {name, category} = req.body;

  const subCategory = await SubCategoryModel.findOneAndUpdate (
    {_id: id},
    {name, slug: slugify (name), category},
    {new: true}
  );

  if (!subCategory) {
    return next (new ApiError (`no category for this ${id}`, 404));
  }
  res.status (200).json ({data: subCategory});
});

// @desc    Delete specific sub category
// @route   DELETE /api/v1/subcategories/:id
// @access  Private/Admin
exports.deleteSubCategory = asyncHandler (async (req, res, next) => {
  const {id} = req.params;
  const subCategory = await SubCategoryModel.findByIdAndDelete (id);
  if (!subCategory) {
    return next (new ApiError (`no sub category for this ${id}`, 404));
  }
  res.status (204).send ();
});
