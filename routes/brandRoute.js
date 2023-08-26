const express = require ('express');
const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require ('../utils/validators/brandValidator');

const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require ('../services/brandService');

const authService = require ('../services/authService');

const router = express.Router ();

router
  .route ('/')
  .post (
    authService.protect,
    authService.allowedTo ('admin', 'manager'),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  )
  .get (getBrands);

router
  .route ('/:id')
  .get (getBrandValidator, getBrand)
  .put (
    authService.protect,
    authService.allowedTo ('admin', 'manager'),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete (
    authService.protect,
    authService.allowedTo ('admin'),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
