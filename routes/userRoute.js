const express = require ('express');

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
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
} = require ('../services/userService');

const router = express.Router ();

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
