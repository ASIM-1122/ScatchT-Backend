const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
        select: false,
    },
    mobile: {
        type: String,
        required: true,
        unique: false,
    },
    image: {
        type: String,
    },
    cart: {
        type: Array,
        default: [],
    },
    product:{
        type:Array,
        default: [],
    }
 

})


module.exports = mongoose.model('User', userSchema);