// models/productModel.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  image: {
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
  },
  imgSection: {
    type: String,
    enum: ['home', 'news', 'footer', 'promo'],
    required: true,
  },
  bgColor: { type: String, required: true },
  panelColor: { type: String, required: true },
  textColor: { type: String, required: true },
});

module.exports = mongoose.model('Product', productSchema);
