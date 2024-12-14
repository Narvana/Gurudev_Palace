const express=require('express')

const router=express.Router()

const {BookRoom,getBookRoom,getOldBookRoom,updateBookRoom}=require('../controller/RoomBook.controller');

const {verify}=require('../middleware/verifyToken');

router.post('/Book/Admin',verify(['ADMIN']),BookRoom);

router.get('/Get/Booked/Room/Admin',verify(['ADMIN']),getBookRoom);

router.get('/Get/Old/Book/Room/Admin',verify(['ADMIN']),getOldBookRoom);

router.put('/Update/UnBook/Admin',verify(['ADMIN']),updateBookRoom);

module.exports=router 