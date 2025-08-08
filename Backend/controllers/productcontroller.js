const mongoose = require('mongoose')
const Product = require('../models/productModel')
const cloudinary = require('../utils/cloudinary')

exports.createProduct = async(req,res,next)=>{
    try{
        const {name,description,price,currency} = req.body

        if(!name || !description || !price || !currency){
            return res.status(400).json({message:"All fields are required"})
        }

        if(!req.files || !req.files.image){
            return res.status(400).json({message:"No image file uploaded"})
        }

        const imageFile = req.files.image

        const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
            folder: 'products'  
          });

        const existingProduct = await Product.findOne({name})
        if(existingProduct){
            return res.status(400).json({message:"Product already exist"})
        }

        const product = new Product({name,description,price,currency,image:result.secure_url})
        await product.save()
        res.status(201).json({message:"Product created successfully",product:product})
    }
    catch(err){
        next(err)
    }

}

exports.getAllProducts = async(req,res,next)=>{
    try{
        const products = await Product.find()

        if(products.length === 0){
            return res.status(400).json({message:"No products found"})
        }

        res.status(200).json({message:"Products fetched successfully",products:products})
    }
    catch(err){
        next(err)
    }
}

exports.getProduct = async(req,res,next)=>{
    try{
        const id = req.params.id

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID format" });
          }

        const product = await Product.findById(id)
        if(!product){
            return res.status(400).json({message:"No product found"})
        }

        res.status(200).json({message:"Product fetched successfully",product:product})
    }
    catch(err){
        next(err)
    }
}

exports.updateProduct = async(req,res,next)=>{
    try{
        const id = req.params.id
        const data = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid product ID format" });
          }

        const product = await Product.findByIdAndUpdate(id,data,{new:true})
        if(!product){
            return res.status(400).json({message:"Product not found"})
        }

        res.status(200).json({message:"Product updated successfully",product})
    }
    catch(err){
        next(err)
    }

}

exports.deleteProduct = async(req,res,next)=>{
    try{
        const id = req.params.id 

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid Product id format"})
        }

        const product = await Product.findByIdAndDelete(id)
        if(!product){
            return res.status(400).json({message:"Product not found"})
        }

        res.status(200).json({message:"Product deleted successfully"})
    }
    catch(err){
        next(err)
    }

}