const errorHandler = (err,req,res,next)=>{
    console.log(err);

    const statuscode = res.statusCode !== 200 ? res.statusCode : 500
    res.status(statuscode).json({
        success:false,
        message: err.message || 'Internal server error'
    })
}

module.exports = errorHandler;