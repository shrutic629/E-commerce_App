const express = require('express');
const dotenv = require('dotenv').config()
const connectDB = require('./config/db.js')
const errorHandler = require('./middleware/errorHandler')
const fileUpload = require('express-fileupload')

const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json())

connectDB()

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

const customerRoutes = require('./routes/customerRoutes.js')
app.use('/api/customers',customerRoutes)

const sellerRoutes = require('./routes/sellerRoutes.js')
app.use('/api/sellers',sellerRoutes)

// const productRoutes = require('./routes/productRoutes')
// app.use('/api/products',productRoutes)

app.get('/', (req, res) => {
    res.send('API is running...');
  });

app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`app is listening on port ${PORT}`)
})