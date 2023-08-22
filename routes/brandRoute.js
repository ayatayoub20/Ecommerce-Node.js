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

const router = express.Router ();

router
  .route ('/')
  .post (uploadBrandImage, resizeImage, createBrandValidator, createBrand)
  .get (getBrands);

router
  .route ('/:id')
  .get (getBrandValidator, getBrand)
  .put (uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete (deleteBrandValidator, deleteBrand);

module.exports = router;
