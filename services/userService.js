const mongoose = require('mongoose');
const userModel = require('../models/userModel');
const { hashPassword } = require('../utils/hashPassword');


module.exports.createUser = async ({name,email,password,mobile,image}) => {
    try {
        if(!name || !email || !password) {
            throw new Error('All fields are required');
        }
       
        const hashedPassword = await hashPassword(password);
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            mobile,
            image: image || 'https://example.com/default-image.jpg', // Default image URL
            cart: [],
            product: [],
          
        });
        return user;

    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
}