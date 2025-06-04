const express = require('express');
const router = express.Router();
const { registerOwner, ownerLogin,ownerLogout } = require('../controllers/ownerController');
const {body} = require('express-validator');

router.post('/register', 

    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    registerOwner
);

router.post('/login', 
    body('email').isEmail().withMessage('Invalid email format'), 
    ownerLogin
);

router.post('/logout', ownerLogout);

module.exports = router;