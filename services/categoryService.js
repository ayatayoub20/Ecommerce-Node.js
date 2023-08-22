const asyncHandler = require ('express-async-handler');
const sharp = require ('sharp');
const {v4: uuidv4} = require ('uuid');

const CategoryModel = require ('../models/categoryModel');
const factory = require ('./handlersFactory');
const {uploadSingleImage} = require ('../middlewares/uploadImageMiddleware');

// Upload single image
exports.uploadCategoryImage = uploadSingleImage ('image');

// Image processing
exports.resizeImage = asyncHandler (async (req, res, next) => {
  const filename = `category-${uuidv4 ()}-${Date.now ()}.jpeg`;

  if (req.file) {
    await sharp (req.file.buffer)
      .resize (600, 600)
      .toFormat ('jpeg')
      .jpeg ({quality: 95})
      .toFile (`uploads/categories/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next ();
});

// @desc    Get list of categories
// @route   GET /api/categories
// @access  Public
// exports.getCategories = asyncHandler (async (req, res) => {
//  // Build query
//  const documentsCount = await CategoryModel.countDocuments ();
//  const apiFeatures = new ApiFeatures (CategoryModel.find (), req.query)
//    .filter ()
//    .search ()
//    .sort ()
//    .limitFields ()
//    .paginate (documentsCount);

//  // Execute query
//  const {mongooseQuery, paginationResult} = apiFeatures;
//  const categories = await mongooseQuery;
//  res.status (200).json ({
//    results: categories.length,
//    paginationResult,
//    data: categories,
//  });
// });
exports.getCategories = factory.getAll (CategoryModel);
// @desc    Get specific category by id
// @route   GET /api/categories/:id
// @access  Public
// exports.getCategory = asyncHandler (async (req, res, next) => {
//   const {id} = req.params;
//   const category = await CategoryModel.findById (id);
//   if (!category) {
//     return next (new ApiError (`no category for this ${id}`, 404));
//   }
//   res.status (200).json ({data: category});
// });
exports.getCategory = factory.getOne (CategoryModel);

// @desc    Create category
// @route   POST  /api/categories
// @access  Private/Admin-Manager
// exports.createCategory = asyncHandler (async (req, res, next) => {
//   // Check if the name is provided and is a non-empty string
//   const {name} = req.body;
//   if (!name || typeof name !== 'string') {
//     return res
//       .status (400)
//       .json ({error: 'Category name is required and must be a string.'});
//   }
//   // Create a category and save it to the database
//   const category = await CategoryModel.create ({name, slug: slugify (name)});
//   res.status (201).json ({data: category});
// });

exports.createCategory = factory.createOne (CategoryModel);

// @desc    Update specific category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
// exports.updateCategory = asyncHandler (async (req, res, next) => {
//   const {id} = req.params;
//   const {name} = req.body;

//   const category = await CategoryModel.findOneAndUpdate (
//     {_id: id},
//     {name, slug: slugify (name)},
//     {new: true}
//   );

//   if (!category) {
//     return next (new ApiError (`no category for this ${id}`, 404));
//   }
//   res.status (200).json ({data: category});
// });
exports.updateCategory = factory.updateOne (CategoryModel);

// @desc    Delete specific category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
// exports.deleteCategory = asyncHandler (async (req, res, next) => {
//   const {id} = req.params;
//   const category = await CategoryModel.findByIdAndDelete (id);
//   if (!category) {
//     return next (new ApiError (`no category for this ${id}`, 404));
//   }
//   res.status (204).send ();
// });
exports.deleteCategory = factory.deleteOne (CategoryModel);
