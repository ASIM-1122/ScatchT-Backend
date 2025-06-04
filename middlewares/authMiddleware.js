const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const blacklistModel = require('../models/blackListToken');

module.exports = async (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
        if(!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const isBlacklisted = await blacklistModel.findOne({token: token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            const user = await UserModel.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = user;
            next();
        }catch (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
}

