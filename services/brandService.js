const asyncHandler = require ('express-async-handler');
const {v4: uuidv4} = require ('uuid');
const sharp = require ('sharp');

const BrandModel = require ('../models/brandModel');
const factory = require ('./handlersFactory');


const {uploadSingleImage} = require ('../middlewares/uploadImageMiddleware');

// Upload single image
exports.uploadBrandImage = uploadSingleImage ('image');

// Image processing
exports.resizeImage = asyncHandler (async (req, res, next) => {
  const filename = `brand-${uuidv4 ()}-${Date.now ()}.jpeg`;

  await sharp (req.file.buffer)
    .resize (600, 600)
    .toFormat ('jpeg')
    .jpeg ({quality: 95})
    .toFile (`uploads/brands/${filename}`);

  // Save image into our db
  req.body.image = filename;

  next ();
});
// @desc    Get list of brands
// @route   GET /api/brands
// @access  Public
// exports.getBrands = asyncHandler (async (req, res) => {
//   // Build query
//   const documentsCount = await BrandModel.countDocuments ();
//   const apiFeatures = new ApiFeatures (BrandModel.find (), req.query)
//     .filter ()
//     .search ()
//     .sort ()
//     .limitFields ()
//     .paginate (documentsCount);

//   // Execute query
//   const {mongooseQuery, paginationResult} = apiFeatures;
//   const brands = await mongooseQuery;
//   res.status (200).json ({
//     results: brands.length,
//     paginationResult,
//     data: brands,
//   });
// });
exports.getBrands = factory.getAll (BrandModel);

// @desc    Get specific brand by id
// @route   GET /api/brands/:id
// @access  Public
// exports.getBrand = asyncHandler (async (req, res, next) => {
//   const {id} = req.params;
//   const brand = await BrandModel.findById (id);
//   if (!brand) {
//     return next (new ApiError (`no brand for this ${id}`, 404));
//   }
//   res.status (200).json ({data: brand});
// });
exports.getBrand = factory.getOne (BrandModel);

// @desc    Create brand
// @route   POST  /api/categories
// @access  Private/Admin-Manager
// exports.createBrand = asyncHandler (async (req, res, next) => {
//   // Check if the name is provided and is a non-empty string
//   const {name} = req.body;
//   if (!name || typeof name !== 'string') {
//     return res
//       .status (400)
//       .json ({error: 'Brand name is required and must be a string.'});
//   }
//   // Create a brand and save it to the database
//   const brand = await BrandModel.create ({name, slug: slugify (name)});
//   res.status (201).json ({data: brand});
// });
exports.createBrand = factory.createOne (BrandModel);

// @desc    Update specific brand
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
// exports.updateBrand = asyncHandler (async (req, res, next) => {
//   const {id} = req.params;
//   const {name} = req.body;

//   const brand = await BrandModel.findOneAndUpdate (
//     {_id: id},
//     {name, slug: slugify (name)},
//     {new: true}
//   );

//   if (!brand) {
//     return next (new ApiError (`no brand for this ${id}`, 404));
//   }
//   res.status (200).json ({data: brand});
// });
exports.updateBrand = factory.updateOne (BrandModel);

// @desc    Delete specific brand
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
// exports.deleteBrand = asyncHandler (async (req, res, next) => {
//   const {id} = req.params;
//   const brand = await BrandModel.findByIdAndDelete (id);
//   if (!brand) {
//     return next (new ApiError (`no brand for this ${id}`, 404));
//   }
//   res.status (204).send ();
// });
exports.deleteBrand = factory.deleteOne (BrandModel);
