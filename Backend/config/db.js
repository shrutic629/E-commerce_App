const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Mongodb connected')
    }
    catch(err){
        console.log('Mongodb connection error',err)
    }
}

module.exports = connectDB;
