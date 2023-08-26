const express = require ('express');

const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require ('../services/categoryService');

const subcategoriesRoute = require ('./subCategoryRoute');
const authService = require ('../services/authService');

const {
  getCategoryValidator,
  updateCategoryValidator,
  createCategoryValidator,
  deleteCategoryValidator,
} = require ('../utils/validators/categoryValidator');

const router = express.Router ();

router.use ('/:categoryId/subcategories', subcategoriesRoute);

router
  .route ('/')
  .post (
    authService.protect,
    authService.allowedTo ('admin', 'manager'),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  )
  .get (getCategories);
router
  .route ('/:id')
  .get (getCategoryValidator, getCategory)
  .put (
    authService.protect,
    authService.allowedTo ('admin', 'manager'),
    uploadCategoryImage,
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete (
    authService.protect,
    authService.allowedTo ('admin'),
    uploadCategoryImage,
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
