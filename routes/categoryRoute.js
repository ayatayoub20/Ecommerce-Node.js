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
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete (deleteCategoryValidator, deleteCategory);

module.exports = router;
