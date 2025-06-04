const mongoose = require('mongoose');
const productModel = require('../models/productModel');

module.exports.addProduct = async ({
    name,
    price,
    discount,
    bgColor,
    panelColor,
    textColor,
    image,
    imgSection
}) => {
    try {
        if (!name || !price || !discount || !bgColor || !panelColor || !textColor || !imgSection) {
            throw new Error('All fields are required');
        }
        const product = await productModel.create({
            name,
            price,
            discount,
            bgColor,
            panelColor,
            textColor,
            image,
            imgSection
        });
        return product;
    

    }catch(err){
        throw new Error(err.message);
    }
}