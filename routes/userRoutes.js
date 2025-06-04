const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const { registerUser,loginUser, logoutUser } = require('../controllers/userController');
const { body } = require('express-validator');

router.post('/register',
    body('name').isLength({min: 3}).withMessage('Name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min: 4}).withMessage('Password must be at least 4 characters long'),
    registerUser
);

router.post('/login',
    body('email').isEmail().withMessage('Invalid email address'),
    loginUser
);

router.get('/logout', logoutUser);

router.get('/profile', authMiddleware, (req, res) => {
    const user = req.user;
    res.status(200).json({
        'message': 'User profile',
         user
    })
});

module.exports = router;