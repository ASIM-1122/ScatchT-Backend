const mongoose = require('mongoose');

const sectionImageSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',     // 💡 Auto-linked to the Product model
    required: true,
  },
  section: {
    type: String,
    enum: ['landing', 'news', 'footer', 'promo'], // 📌 Customize your sections here
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('SectionImage', sectionImageSchema);
