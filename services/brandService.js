const asyncHandler = require ('express-async-handler');
const slugify = require ('slugify');
const BrandModel = require ('../models/brandModel');
const ApiError = require ('../utils/apiError');

// @desc    Get list of brands
// @route   GET /api/brands
// @access  Public
exports.getBrands = asyncHandler (async (req, res) => {
  const page = res.query.page * 1 || 1;
  const limit = res.query.limit * 1 || 5;
  const skip = (page - 1) * limit;

  const brands = await BrandModel.find ({}).skip (skip).limit (limit);
  res.status (201).json ({requests: brands.length, page, data: brands});
});

// @desc    Get specific brand by id
// @route   GET /api/brands/:id
// @access  Public
exports.getBrand = asyncHandler (async (req, res, next) => {
  const {id} = req.params;
  const brand = await BrandModel.findById (id);
  if (!brand) {
    return next (new ApiError (`no brand for this ${id}`, 404));
  }
  res.status (200).json ({data: brand});
});

// @desc    Create brand
// @route   POST  /api/categories
// @access  Private/Admin-Manager
exports.createBrand = asyncHandler (async (req, res, next) => {
  // Check if the name is provided and is a non-empty string
  const {name} = req.body;
  if (!name || typeof name !== 'string') {
    return res
      .status (400)
      .json ({error: 'Brand name is required and must be a string.'});
  }
  // Create a brand and save it to the database
  const brand = await BrandModel.create ({name, slug: slugify (name)});
  res.status (201).json ({data: brand});
});

// @desc    Update specific brand
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
exports.updateBrand = asyncHandler (async (req, res, next) => {
  const {id} = req.params;
  const {name} = req.body;

  const brand = await BrandModel.findOneAndUpdate (
    {_id: id},
    {name, slug: slugify (name)},
    {new: true}
  );

  if (!brand) {
    return next (new ApiError (`no brand for this ${id}`, 404));
  }
  res.status (200).json ({data: brand});
});

// @desc    Delete specific brand
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteBrand= asyncHandler (async (req, res, next) => {
  const {id} = req.params;
  const brand = await BrandModel.findByIdAndDelete (id);
  if (!brand) {
    return next (new ApiError (`no brand for this ${id}`, 404));
  }
  res.status (204).send ();
});
