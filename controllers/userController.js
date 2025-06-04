const mongoose = require('mongoose');
const { validationResult} = require('express-validator');
const userModel = require('../models/userModel');
const {createUser} = require('../services/userService');
const { generateToken } = require('../utils/generateToken'); //  a function to generate JWT tokens
const {comparePassword} = require('../utils/hashPassword'); //  a function to compare passwords
const { createBlackListToken } = require('../services/blackListTokenService'); // a function to add the token to the blacklist
const jwt = require('jsonwebtoken');


module.exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password,mobile, image } = req.body;
         const existingUser = await userModel.findOne({ email });
                if (existingUser){
                   return res.status(401).json({ message: 'User already exists' });
                }

         const user = await createUser({
            name,
            email,
            password,
            mobile,
            image
        });
        if (!user) {
            return res.status(400).json({ message: 'User registration failed' });
        }
        // Generate a token for the user
        const token = await generateToken(user); // generateToken() is a function to generate JWT tokens
        // Send the token in the response   
        res.cookie('token', token, {
  httpOnly: true,
  secure: false,
  sameSite: 'Lax'
});
        res.status(201).json({ message: 'User registered successfully', user,token});

    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        // Check if the user exists in the database
        const user = await userModel.findOne({ email }).select('+password');
        if(!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

       const isMatch = await comparePassword(password,user.password); // comparePassword() is a function to compare passwords
       if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // If the password matches, generate a token for the user
       
        const token = await generateToken(user); // generateToken() is a function to generate JWT tokens
        // Send the token in the response   
        res.cookie('token', token, {
  httpOnly: true,
  secure: false,
  sameSite: 'Lax'
});
        res.status(200).json({ message: 'User logged in successfully', user,token });


    }catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.logoutUser = async (req, res) => {
    try{
        const token = req.cookies.token;
        if (!token){
            return res.status(401).json({ message: 'No token provided' });
        }
        // Verify the token and get the user ID
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        // Add the token to the blacklist
        const blackListToken = await createBlackListToken(token,user._id); // a function to add the token to the blacklist
        if (!blackListToken) {
            return res.status(400).json({ message: 'Token blacklisting failed' });
        }
        // Clear the cookie
        res.clearCookie('token');
        res.status(200).json({ message: 'User logged out successfully' });


    }catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}