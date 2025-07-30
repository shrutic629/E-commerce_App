const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const sellerSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,'Firstname is required'],
        trim:true
    },
    lastName:{
        type:String,
        required:[true,'Lastname is required'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        trim:true,
        unique:true,
        validate: {
            validator: function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Please enter a valid email address'
            }
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(value);
            },
            message: 'Password must include uppercase, lowercase, and a number'
        },
    },
    phoneCountryCode:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true
    }
},{timeStamps:true,versionKey:false})

sellerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

const sellerModel = mongoose.model('Seller',sellerSchema)
module.exports = sellerModel;
