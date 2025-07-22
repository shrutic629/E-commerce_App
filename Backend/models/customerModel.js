const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const customerSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,'FirstName is required'],
        trim:true
    },
    lastName:{
        type:String,
        required:[true,'LastName is required'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        lowercase:true, //  Need explanation
        unique:true,
        trim:true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        trim:true,
        validate: {
            validator: function (v) {
                return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(v);
            },
            message: () => `Password must be at least 8 characters long and contain at least one letter and one number`
        }
    },
    phoneCountryCode:{
        type:String,
        required:[true,'Country Code is required'],
    },
    phoneNumber:{
        type:String,
        required:[true,'Phone Number is required'],
        validate: {
            validator: function (v) {
            return /^\d{10}$/.test(v); 
            },
            message: props => `${props.value} is not a valid 10-digit phone number`
        }
    }
},{timestamps:true,versionKey:false})

customerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

const customerModel = mongoose.model("Customer",customerSchema)
module.exports = customerModel;