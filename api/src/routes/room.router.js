const express=require('express')

const router=express.Router()

const room=require('../controller/room.controller');

const {verify}=require('../middleware/verifyToken');

const upload=require("../middleware/ImageUpload/imageUploadMiddleware");

router.post('/Add/Admin',verify(['ADMIN']),upload.fields([{name:'roomPictures'}]),room.addRoom);

router.get('/Get',room.getRoom);

router.put('/Update/Admin',verify(['ADMIN']),upload.fields([{name:'roomPictures'}]),room.updateRoom);

router.delete('/Delete/Admin',verify(['ADMIN']),room.deleteRoom);

router.get('/Data/Admin',verify(['ADMIN']),room.RoomData);

module.exports=router 