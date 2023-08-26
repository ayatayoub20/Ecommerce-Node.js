const express = require ('express');
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require ('../utils/validators/productValidator');

const {
  getProducts,
  createproduct,
  getproduct,
  updateproduct,
  deleteproduct,
  uploadProductImages,
  resizeProductImages,
} = require ('../services/productService');

const authService = require('../services/authService');

const router = express.Router ();

router
  .route ('/')
  .post (
    authService.protect,
    authService.allowedTo ('admin', 'manager'),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createproduct
  )
  .get (getProducts);

router
  .route ('/:id')
  .get (getProductValidator, getproduct)
  .put (
    authService.protect,
    authService.allowedTo ('admin', 'manager'),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateproduct
  )
  .delete (
    authService.protect,
    authService.allowedTo ('admin'),
    deleteProductValidator,
    deleteproduct
  );

module.exports = router;
