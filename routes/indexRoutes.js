const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');

router.get('/',authMiddleware, (req, res) => {
  res.send('Welcome to the Landing Page!');
});

module.exports= router; 