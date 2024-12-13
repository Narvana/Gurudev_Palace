require('dotenv').config();

const Room=require('../model/room.model')

const ApiError=require('../utils/ApiResponse/ApiError');
const ApiSuccess=require('../utils/ApiResponse/ApiSuccess');
const {uploadToFirebase} = require('../middleware/ImageUpload/firebaseConfig');
// const {uploadBase64ToFirebase} = require('../utils/middleware/ImageUpload/firebaseConfig');

const addRoom=async(req,res,next)=>{    

    const
    {
        property,roomType,roomSize,roomNum,guestsNum,roomPrice, roomDiscountPrice, roomAvalibility,roomAmenities
    } = req.body;

    let imageURL = [];
    let uploadResult;
    let link;
    let roomPictures;

    if(req.files && req.files['roomPictures'] && req.files['roomPictures'].length > 0) 
    {
        await Promise.all(
            req.files['roomPictures'].map(async (file) => {
                uploadResult = await uploadToFirebase(file);
                link = uploadResult;
                imageURL.push(link);
            })
        );
        roomPictures = imageURL
    }
    else
    {
        roomPictures = [];
    }
    
    try 
    {
        const stay= new Room({
            property,
            roomType,
            roomSize,
            roomNum,
            guestsNum,
            roomPrice, 
            roomDiscountPrice, 
            roomAvalibility,
            roomAmenities,
            roomPictures
        })

    const Stay = await stay.save();

    return next(ApiSuccess(201,Stay,'Room Added Successfully'));

    } 
    catch (error) {
        console.log({
            'Internal Serve Error, ' : error.message,
            error
            });
            
        if(error.name === 'ValidationError')
        {
            const errorMessages = Object.values(error.errors).map(error => error.message);
            return next(ApiError(500,errorMessages[0]));            
        }
        else if (error.code === 11000) {
            
            const duplicateField = Object.keys(error.keyValue);
            return next(
                ApiError(
                    400,
                    `Duplicate error:  Room Number ${error.keyValue.roomNum} already exists for ${duplicateField[0]} '${error.keyValue.property}'.`
                )
            );
        }
        // Default error
        return next(ApiError(500, `Internal Server Error: ${error.message}`));
    }
}

const getRoom = async(req,res,next)=>{
   
    const {property,roomType}=req.query;
    let searchCondition={}

    if(roomType && property)
    {
        searchCondition['property']=property;
        searchCondition['roomType']=roomType;
    }
    if(roomType && !property)
    {
        return next(ApiError(400,'Please select property first'));
    }
    if(property)
    {
        searchCondition['property']=property;
    }


    // console.log(searchCondition);
    

    try {
            const Rooms=await Room.aggregate([
                {
                    $match: searchCondition
                }
            ]);

            if(Rooms.length === 0)
            {
                return next(ApiError(400,'No Room Found'));
            }

            return next(ApiSuccess(201,Rooms,'Total Rooms'));
        
    } catch (error) {
        console.log({
            'Internal Serve Error, ' : error.message,
            error
            });
        // Default error
        return next(ApiError(500, `Internal Server Error: ${error.message}`)); 
    }
}

const updateRoom= async(req,res,next) =>{

    const id= req.query.RoomID;

    if(!id)
    {
        return next(ApiError(400, `Please Provide Room ID`)); 
    }

    try {
        const RoomExist = await Room.findById(id);
        if(!RoomExist)
        {
            return next(ApiError(400, `No Room Found with Provided Room ID`));    
        }
    
        const 
        {
            property,roomType,roomSize,roomNum,guestsNum,roomPrice, roomDiscountPrice, roomAvalibility,roomAmenities
        } = req.body;
    
        let imageURL = [];
        let uploadResult;
        let link;
        let roomPictures;
    
        if(req.files && req.files['roomPictures'] && req.files['roomPictures'].length > 0) 
        {
            await Promise.all(
                req.files['roomPictures'].map(async (file) => {
                    uploadResult = await uploadToFirebase(file);
                    link = uploadResult;
                    imageURL.push(link);
                })
            );
            roomPictures = imageURL
        }
        else
        {
            roomPictures = RoomExist.roomPictures ;
        }
            
        const RoomUpdate = await Room.findByIdAndUpdate(
            id,
            {
                $set:{
                    property,
                    roomType,
                    roomSize,
                    roomNum,
                    guestsNum,
                    roomPrice, 
                    roomDiscountPrice, 
                    roomAvalibility,
                    roomAmenities,
                    roomPictures
                }
            },
            {
                new: true
            }
        );
        return next(ApiSuccess(200,RoomUpdate,'Room  Updated Successfully'));
    } catch (error) {    
        console.log({
            'Internal Serve Error, ' : error.message,
            error
            });
            
        if(error.name === 'ValidationError')
        {
            const errorMessages = Object.values(error.errors).map(error => error.message);
            return next(ApiError(500,errorMessages[0]));            
        }
        // Default error
        return next(ApiError(500, `Internal Server Error: ${error.message}`));
    }
}

const deleteRoom = async(req,res,next) => {
    const id=req.query.RoomID;
    try {
        const roomSearch=await Room.findById(id);        
        if (!roomSearch) 
        {
            return next(ApiError(400, `Room Not Found`));
        } 
        else 
        { 
            await Room.deleteOne({"_id":id});
            return next(ApiSuccess(200,[],`Room Removed Successfully`));
        }
    } catch (error) {
        console.log({
            'Internal Serve Error, ' : error.message,
            error,
        });
        return next(ApiError(500, `Error while Deleting: ${error.message}`));
    }
}

module.exports={
    addRoom,
    getRoom,
    updateRoom,
    deleteRoom
}