const mongoose = require('mongoose');
const ownerModel = require('../models/ownerModel');

module.exports.createOwner = async ({
    name,
    email,
    password,
}) => {
   if(!name || !email || !password) {
        throw new Error('All fields are required');
    }
    try{
        const owner = await ownerModel.create({
            name,
            email,
            password
        });
        return owner;
        


    }catch(err){
        console.log(err);
        throw new Error('Internal server error');
    }
}