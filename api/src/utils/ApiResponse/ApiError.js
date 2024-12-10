
const ApiErrors = (statusCode,message)=>{
    return {
        status:0,
        statusCode,
        message,
    }
}

module.exports=ApiErrors
