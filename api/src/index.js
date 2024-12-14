require('dotenv').config();
require('./database/AD.database')

const express = require('express')
const app=express()
const helmet = require('helmet')
const cors=require('cors')
const https = require('https')
const path = require('path')
const fs = require('fs')
const cookieParser=require('cookie-parser')

const roomRoute=require('./routes/room.router');
const authRoute=require('./routes/auth.router');
const roomBookRoute= require('./routes/roomBook.router');

const mongoose = require('mongoose');
const multer=require('multer');

const port = process.env.PORT || 5000;


app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// app.use('/api/user',userRoute)
app.use('/api/auth',authRoute);
app.use('/api/Room',roomRoute);
app.use('/api/Room',roomBookRoute);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) 
    {
        // Handle Multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return  res.status(413).json({
                status:0,
                data:"",
                statusCode : 413,
                message:`${err.message}, max limit is 5MB`,
              });
        }
    } 
    
    if (err.message === 'Invalid file type. Only JPEG, PNG, and GIF files are allowed') 
    {
            return  res.status(400).json({
                status:0,
                data:"",
                statusCode : 400,
                message: 'Invalid file type. Only JPEG, PNG, and GIF files are allowed.',
              });    
    }
    else
    {
        const status=err.status || 0;        
        const statusCode = err.statusCode || 500; 
        const data=err.data || "";
        const message = err.message || 'Internal Server Error';
        return res.status(statusCode).json({
          status,
          data,
          statusCode,
          message,
        });    
    }

});


app.get('/test/port',(req,res,next)=>{
       res.status(201).send(`Secure Connection with port ${port}`)
})

app.get('/test/database',(req,res)=>{
    const isConnected= mongoose.connection.readyState===1;
    if(isConnected){
        res.status(201).json({message :'MongoDB connection is active'})
    }
    else{
        res.status(500).json({message :'MongoDB connection is not active'})
    }
})

app.use('/',(req,res)=>{
    res.send('hello')
})

// const sslServer=https.createServer({
//     key:fs.readFileSync(path.join(__dirname,'cert','ryans-key.pem')),
//     cert:fs.readFileSync(path.join(__dirname, 'cert', 'ryans-cert.pem')),
// },app)
// sslServer.
 
app.listen(port,()=>{
    console.log(`Secure Connection with port ${port}`)
})