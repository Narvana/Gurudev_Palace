const mongoose = require('mongoose')
require('dotenv').config()

const uri=process.env.URI
 
mongoose.connect(uri,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000, // 30 seconds
})
.then(()=>{
    console.log('Connection Successfull with MongoDB')
})
.catch((error)=>{
    console.log(`No Connection with MongoDB. Error: ${error}`)
})
 