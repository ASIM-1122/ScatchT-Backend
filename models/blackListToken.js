const mongoose = require('mongoose');

const blackListTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    }, { timestamps: true }

);

module.exports = mongoose.model('BlackListToken', blackListTokenSchema);
// This model is used to store blacklisted tokens in the database.