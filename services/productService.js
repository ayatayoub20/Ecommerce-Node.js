const asyncHandler = require ('express-async-handler');
const {v4: uuidv4} = require ('uuid');
const sharp = require ('sharp');

const {uploadMixOfImages} = require ('../middlewares/uploadImageMiddleware');
const ProductModel = require ('../models/productModel');
const factory = require ('./handlersFactory');

exports.uploadProductImages = uploadMixOfImages ([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 5,
  },
]);

exports.resizeProductImages = asyncHandler (async (req, res, next) => {
  // console.log(req.files);
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4 ()}-${Date.now ()}-cover.jpeg`;

    await sharp (req.files.imageCover[0].buffer)
      .resize (2000, 1333)
      .toFormat ('jpeg')
      .jpeg ({quality: 95})
      .toFile (`uploads/products/${imageCoverFileName}`);

    // Save image into our db
    req.body.imageCover = imageCoverFileName;
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all (
      req.files.images.map (async (img, index) => {
        const imageName = `product-${uuidv4 ()}-${Date.now ()}-${index + 1}.jpeg`;

        await sharp (img.buffer)
          .resize (2000, 1333)
          .toFormat ('jpeg')
          .jpeg ({quality: 95})
          .toFile (`uploads/products/${imageName}`);

        // Save image into our db
        req.body.images.push (imageName);
      })
    );

    next ();
  }
});

// @desc    Get list of products
// @route   GET /api/products
// @access  Public
// exports.getProducts = asyncHandler (async (req, res) => {
//   // Build query
//   const documentsCount = await ProductModel.countDocuments ();
//   const apiFeatures = new ApiFeatures (ProductModel.find (), req.query)
//     .filter ()
//     .search ('Products') // Pass the correct modelName here
//     .sort ()
//     .limitFields ()
//     .paginate (documentsCount);

//   // Execute query
//   const {mongooseQuery, paginationResult} = apiFeatures;
//   const products = await mongooseQuery;
//   res.status (200).json ({
//     results: products.length,
//     paginationResult,
//     data: products,
//   });
// });
exports.getProducts = factory.getAll (ProductModel);

// @desc    Get specific product by id
// @route   GET /api/products/:id
// @access  Public
// exports.getproduct = asyncHandler (async (req, res, next) => {
//   const {id} = req.params;
//   const product = await ProductModel.findById (id);
//   if (!product) {
//     return next (new ApiError (`no product for this ${id}`, 404));
//   }
//   res.status (200).json ({data: product});
// });
exports.getproduct = factory.getOne (ProductModel);

// @desc    Create product
// @route   POST  /api/categories
// @access  Private/Admin-Manager
// exports.createproduct = asyncHandler (async (req, res) => {
//   req.body.slug = slugify (req.body.title);
//   const product = await ProductModel.create (req.body);
//   res.status (201).json ({data: product});
// });
exports.createproduct = factory.createOne (ProductModel);

// @desc    Update specific product
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin-Manager
// exports.updateproduct = asyncHandler (async (req, res, next) => {
//   const {id} = req.params;
//   req.body.slug = slugify (req.body.title);

//   const product = await ProductModel.findOneAndUpdate ({_id: id}, req.body, {
//     new: true,
//   });

//   if (!product) {
//     return next (new ApiError (`no product for this ${id}`, 404));
//   }
//   res.status (200).json ({data: product});
// });
exports.updateproduct = factory.updateOne (ProductModel); //factory function

// @desc    Delete specific product
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
// exports.deleteproduct = asyncHandler (async (req, res, next) => {
//   const {id} = req.params;
//   const product = await ProductModel.findByIdAndDelete (id);
//   if (!product) {
//     return next (new ApiError (`no product for this ${id}`, 404));
//   }
//   res.status (204).send ();
// });
exports.deleteproduct = factory.deleteOne (ProductModel);
