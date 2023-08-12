const asyncHandler = require ('express-async-handler');
const slugify = require ('slugify');
const ProductModel = require ('../models/productModel');
const ApiError = require ('../utils/apiError');
const ApiFeatures = require ('../utils/ApiFeatures');

// @desc    Get list of products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler (async (req, res) => {

  //build query
  const apiFeatures = new ApiFeatures (ProductModel.find (), req.query)
    .filter ()
    .search ()
    .sort ()
    .paginate ();

  //excute query
  const products = await apiFeatures.mongodbQuery;
  res.status (201).json ({requests: products.length, data: products});
});

// @desc    Get specific product by id
// @route   GET /api/categories/:id
// @access  Public
exports.getproduct = asyncHandler (async (req, res, next) => {
  const {id} = req.params;
  const product = await ProductModel.findById (id);
  if (!product) {
    return next (new ApiError (`no product for this ${id}`, 404));
  }
  res.status (200).json ({data: product});
});

// @desc    Create product
// @route   POST  /api/categories
// @access  Private/Admin-Manager
exports.createproduct = asyncHandler (async (req, res) => {
  req.body.slug = slugify (req.body.title);
  const product = await ProductModel.create (req.body);
  res.status (201).json ({data: product});
});

// @desc    Update specific product
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
exports.updateproduct = asyncHandler (async (req, res, next) => {
  const {id} = req.params;
  req.body.slug = slugify (req.body.title);

  const product = await ProductModel.findOneAndUpdate ({_id: id}, req.body, {
    new: true,
  });

  if (!product) {
    return next (new ApiError (`no product for this ${id}`, 404));
  }
  res.status (200).json ({data: product});
});

// @desc    Delete specific product
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
exports.deleteproduct = asyncHandler (async (req, res, next) => {
  const {id} = req.params;
  const product = await ProductModel.findByIdAndDelete (id);
  if (!product) {
    return next (new ApiError (`no product for this ${id}`, 404));
  }
  res.status (204).send ();
});
