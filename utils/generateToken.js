// File: utils/generateToken.js
// Description: This file contains a function to generate a JWT token for a user.
const jwt = require('jsonwebtoken');

module.exports.generateToken = async (user) => {
    try {
        const token =  jwt.sign({ id: user._id, email:user.email}, process.env.JWT_SECRET, { expiresIn: '24h' });
        return token;
    } catch (error) {
        throw new Error('Error generating token: ' + error.message);
    }
}