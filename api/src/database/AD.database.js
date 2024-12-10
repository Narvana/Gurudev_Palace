const mongoose = require('mongoose')
require('dotenv').config()

const uri=process.env.URI
 
mongoose.connect(uri)
.then(()=>{
    console.log('Connection Successfull with MongoDB')
})
.catch((error)=>{
    console.log(`No Connection with MongoDB. Error: ${error}`)
})
 