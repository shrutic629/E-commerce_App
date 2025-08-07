const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    price:{
        type:Number,
        required:true,
    },
    currency:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    },
    ratings:{
        type:Number,
    }
},{timestamps:true,versionKey:false})

const productmodel = mongoose.model("Product",productSchema)
module.exports = productmodel