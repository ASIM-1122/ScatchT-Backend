// routes/productRoutes.js
const express = require('express');
const { body } = require('express-validator');
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const upload = require('../middlewares/upoadImages');
const { ownerAuthentication } = require('../middlewares/ownerMiddleware');

const router = express.Router();

router.post(
  '/create',
  ownerAuthentication,
  upload.single('image'), // 🔽 important
  body('name').notEmpty(),
  body('price').isNumeric(),
  body('discount').isNumeric(),
  body('bgColor').notEmpty(),
  body('panelColor').notEmpty(),
  body('textColor').notEmpty(),
  body('imgSection').notEmpty(),
  createProduct
);

router.get('/allproducts', getAllProducts);

router.put(
  '/update/:id',
  ownerAuthentication,
  upload.single('image'), // 🔽 for updating
  body('name').notEmpty(),
  body('price').isNumeric(),
  body('discount').isNumeric(),
  body('bgColor').notEmpty(),
  body('panelColor').notEmpty(),
  body('textColor').notEmpty(),
  body('imgSection').notEmpty(),
  updateProduct
);

router.delete('/delete/:id', ownerAuthentication, deleteProduct);

module.exports = router;
