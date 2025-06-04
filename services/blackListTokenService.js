const mongoose = require('mongoose');
const blackListTokenModel = require('../models/blackListToken');


module.exports.createBlackListToken = async (token,userId) => {
    try {
        const blackListToken = await blackListTokenModel.create({ 
            token,
            userId,
            isBlackListed: true,
            createdAt: new Date(),

         });
        return blackListToken;
    } catch (error) {
        console.error('Error creating black list token:', error);
        throw new Error('Error creating black list token');
    }
}