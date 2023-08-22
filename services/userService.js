const asyncHandler = require ('express-async-handler');
const {v4: uuidv4} = require ('uuid');
const sharp = require ('sharp');
const bcrypt =  require('bcryptjs');
const ApiError = require ('../utils/apiError');

const UserModel = require ('../models/userModel');
const factory = require ('./handlersFactory');

const {uploadSingleImage} = require ('../middlewares/uploadImageMiddleware');

// Upload single image
exports.uploadUserImage = uploadSingleImage ('profileImg');

// Image processing
exports.resizeImage = asyncHandler (async (req, res, next) => {
  const filename = `user-${uuidv4 ()}-${Date.now ()}.jpeg`;

  if (req.file) {
    await sharp (req.file.buffer)
      .resize (600, 600)
      .toFormat ('jpeg')
      .jpeg ({quality: 95})
      .toFile (`uploads/users/${filename}`);
  }

  // Save image into our db
  req.body.profileImg = filename;

  next ();
});
// @desc    Get list of users
// @route   GET /api/users
// @access  private
exports.getUsers = factory.getAll (UserModel);

// @desc    Get specific user by id
// @route   GET /api/users/:id
// @access  private
exports.getUser = factory.getOne (UserModel);

// @desc    Create user
// @route   POST  /api/users
// @access  Private/Admin-Manager
exports.createUser = factory.createOne (UserModel);

// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin-Manager
exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        slug: req.body.slug,
        phone: req.body.phone,
        email: req.body.email,
        profileImg: req.body.profileImg,
        role: req.body.role,
      },
      {
        new: true,
      }
    );
  
    if (!document) {
      return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
  });
  
  exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const document = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
      },
      {
        new: true,
      }
    );
  
    if (!document) {
      return next(new ApiError(`No document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
  });

// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
// exports.deleteUser = factory.deleteOne (UserModel);
exports.deleteUser =  asyncHandler (async (req, res, next) => {
      const {id} = req.params;

     const updatedUser = await UserModel.findOneAndUpdate(
        { _id: id },
        { active: false }, // Update the 'active' field
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return next(new ApiError(`No user found for this ${id}`, 404));
      }
  
      res.status(200).json({ data: updatedUser });
})