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
} = require ('../services/productService');

const router = express.Router ();

router
  .route ('/')
  .post (createProductValidator, createproduct)
  .get (getProducts);

router
  .route ('/:id')
  .get (getProductValidator, getproduct)
  .put (updateProductValidator, updateproduct)
  .delete (deleteProductValidator, deleteproduct);

module.exports = router;
