const express = require ('express');
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
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
  .post (createCategoryValidator, createCategory)
  .get (getCategories);
router
  .route ('/:id')
  .get (getCategoryValidator, getCategory)
  .put (updateCategoryValidator, updateCategory)
  .delete (deleteCategoryValidator, deleteCategory);

module.exports = router;
