const express = require('express');
const { validationResult } = require('express-validator');
const { addProduct } = require('../services/productService');
const productModel = require('../models/productModel');

module.exports.createProduct = async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()){
        return res.status(401).json({message: error.array()});
    }
    const { name, price, discount, bgColor, panelColor, textColor,imgSection } = req.body;
    const image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    try {
        const product = await addProduct({
            name,
            price,
            discount,
            bgColor,
            panelColor,
            textColor,
            image,
            imgSection
        });
        return res.status(201).json({
            status: true,
            message: 'Product created successfully',
            data: product
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
}

module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        return res.status(200).json({
            status: true,
            message: 'Products fetched successfully',
            data: products
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
}


module.exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, discount, bgColor, panelColor, textColor, imgSection } = req.body;
  
    try {
      const updateData = {
        name,
        price,
        discount,
        bgColor,
        panelColor,
        textColor,
        imgSection,
      };
  
      if (req.file) {
        updateData.image = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      }
  
      const product = await productModel.findByIdAndUpdate(id, updateData, { new: true });
      res.status(200).json({ status: true, data: product });
    } catch (err) {
      res.status(500).json({ status: false, message: err.message });
    }
  };


module.exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await productModel.findByIdAndDelete(id);
        return res.status(200).json({
            status: true,
            message: 'Product deleted successfully'
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: err.message
        });
    }
}


