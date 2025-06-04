const express = require('express');
const jwt = require('jsonwebtoken');
const ownerModel = require('../models/ownerModel');

module.exports.ownerAuthentication = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        const user = await ownerModel.findById(decoded.id);
        if (!user || user.email !== process.env.OWNER_EMAIL) {
            return res.status(403).json({ message: 'Forbidden - Not the owner' });
        }

        req.user = decoded;
        next();

    } catch (error) {
        console.error("Owner auth failed:", error.message);
        return res.status(500).json({ message: 'Internal server error in owner authentication' });
    }
};
