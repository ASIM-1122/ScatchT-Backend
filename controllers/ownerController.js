const express = require('express');
const {validationResult} = require('express-validator');
const {hashPassword} = require('../utils/hashPassword');
const ownerModel = require('../models/ownerModel');
const {createOwner} = require('../services/ownerService');
const jwt = require('jsonwebtoken');
const {comparePassword} = require('../utils/hashPassword');

const {createBlackListToken} = require('../services/blackListTokenService');

module.exports.registerOwner = async (req, res) => {

    if(process.env.NODE_ENV !== 'development'){
        return res.status(401).json({message: 'Not allowed to create owner in production'});
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(401).json({errors: errors.array()});
    }
    const {name, email, password} = req.body;

    try{
        const existingOwner = await ownerModel.findOne();
        if (existingOwner){
            return res.status(401).json({message: 'Owner already exists'});
        }
        const hashedPassword = await hashPassword(password);
        const Owner = await createOwner({
            name: name,
            email: email,
            password: hashedPassword
        });
        if (!Owner){
            return res.status(401).json({message: 'Owner not created'});
        }
        const token = await jwt.sign(
            {id:Owner._id, email:Owner.email},
             process.env.JWT_SECRET, 
             {expiresIn: '24h'}
        );
        // Set the token in the cookie
       res.cookie('token', token, {
  httpOnly: true,
  secure: false,
  sameSite: 'Lax'
});
        return res.status(200).json({message: 'Owner created successfully', owner: Owner});
    

    }catch(err){
        console.log(err);
        return res.status(500).json({message: 'Internal server error'});
    }


}

module.exports.ownerLogin = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(401).json({errors: errors.array()});
    }
    const {email, password} = req.body;
    // Check if the request body contains the required fields
    if (!req.body.email || !req.body.password){
        return res.status(401).json({message: 'Email and password are required'});
    }

    // Check if the email and password are not empty
    if (req.body.email.trim() === '' || req.body.password.trim() === ''){
        return res.status(401).json({message: 'Email and password cannot be empty'});
    }

   
    try{
        const Owner = await ownerModel.findOne({email: email});
        if (!Owner){
            return res.status(401).json({message: 'Email or password is incorrect'});
        }
        const isMatch = await comparePassword(password, Owner.password);
        // Check if the password is correct
        if (!isMatch){
            return res.status(401).json({message: 'Email or password is incorrect'});
        }
        const token = await jwt.sign(
            {id:Owner._id, email:Owner.email},
             process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );
        // Set the token in the cookie
      res.cookie('token', token, {
  httpOnly: true,
  secure: false,
  sameSite: 'Lax'
});
      return res.status(200).json({
        message: 'Login successful',
        Owner,
        token
    });
    }catch(err){
        console.log(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

module.exports.ownerLogout = async (req, res) => {
   
    const token = req.cookies.token || req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check if the token is valid
        if (!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        // Find the owner by ID
        const owner = await ownerModel.findById(decoded.id);
        if (!owner) {
            return res.status(401).json({ message: 'Owner not found' });
        }
       const blacklistedToken = await createBlackListToken(token, owner._id);
        if (!blacklistedToken) {
            return res.status(401).json({ message: 'Token not blacklisted' });
        }

        // Clear the token from the cookie
        res.clearCookie('token');
        return res.status(200).json({ message: 'Owner logged out successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
