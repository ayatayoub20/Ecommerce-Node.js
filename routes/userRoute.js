const express = require ('express');

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require ('../utils/validators/userValidator');

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require ('../services/userService');

const authService = require ('../services/authService');

const router = express.Router ();

router.get ('/getMe', authService.protect, getLoggedUserData, getUser);
router.put('/changeMyPassword', updateLoggedUserPassword);
router.put('/updateMe', updateLoggedUserValidator, updateLoggedUserData);
router.delete('/deleteMe', deleteLoggedUserData);


// Admin
router.use (authService.protect, authService.allowedTo ('admin', 'manager'));
router.put (
  '/changePassword/:id',
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route ('/')
  .post (uploadUserImage, resizeImage, createUserValidator, createUser)
  .get (getUsers);

router
  .route ('/:id')
  .get (getUserValidator, getUser)
  .put (uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete (deleteUserValidator, deleteUser);

module.exports = router;
