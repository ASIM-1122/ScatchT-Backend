const bcrypt = require('bcrypt');

module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new Error('Error hashing password');
    }
}

module.exports.comparePassword = async (password,hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
        
    } catch (error) {
        console.error('Error comparing password:', error);
        throw new Error('Error comparing password');
    }
}
