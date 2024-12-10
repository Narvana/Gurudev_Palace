const Room = require('../model/room.model');
const RoomBook = require('../model/RoomBook.model');
const ApiError=require('../utils/ApiResponse/ApiError');
const ApiSuccess=require('../utils/ApiResponse/ApiSuccess');

const BookRoom=async(req,res,next)=>{

    const {RoomID,BookingName,BookingContact,payment,Guests,CheckIn,CheckOut}=req.body;

    try {
        const CheckRoom = await Room.findOne({_id:RoomID});
        console.log(CheckRoom);
        
        if(!CheckRoom)
        {
            return next(ApiError(400,'No Room Found'));
        }
        if(CheckRoom.roomAvalibility === false)
        {
            return next(ApiError(400,'This Room is Booked'));
        }
        
        const GuestInfo= new RoomBook({
            RoomID,
            BookingName,
            BookingContact,
            payment,
            Guests,
            CheckIn,
            CheckOut
        });

        const BookedRoom= await GuestInfo.save();

        const id=RoomID;

        await Room.findByIdAndUpdate(
            id,
            {
                $set:{
                    roomAvalibility:false
                },
            },
            { new: true } // Return the updated document
        );

        return next(ApiSuccess(201,BookedRoom,'Room Booked'))

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
        return next(ApiError(500,`Internal Server Error: ${error.message}`));
    }
}

const getBookRoom = async(req,res,next)=>{
    try {
        
        const Rooms=await RoomBook.aggregate([
               {
                $lookup:{
                    from:'rooms',
                    localField: 'RoomID',
                    foreignField: '_id',
                    as: 'RoomDetails'
                }
               },
               {
                  $unwind: {
                     path: '$RoomDetails', 
                    //  preserveNullAndEmptyArrays: false
                   }
               },
               {
                  $addFields:
                    {
                        FormattedCheckIn: {
                            $dateToString: {
                                format: '%Y-%m-%d %H:%M:%S',
                                date: '$CheckIn',
                                timezone: 'Asia/Kolkata' // Optional: Specify timezone if required
                            }
                        },
                        FormattedCheckOut: {
                            $dateToString: {
                                format: '%Y-%m-%d %H:%M:%S',
                                date: '$CheckOut',
                                timezone: 'Asia/Kolkata' // Optional: Specify timezone if required
                            }
                        }
                    }
               },
               {
                    $project:{
                        RoomNo:'$RoomDetails.roomNum',
                        BookingName:1,
                        BookingContact:1,
                        payment:1,
                        Guests:1,
                        CheckIn:'$FormattedCheckIn',
                        CheckOut:'$FormattedCheckOut'
                    }
               } 
        ]);
        

        if(Rooms.length === 0)
        {
            return next(ApiError(400,'No Room Found'));
        }

        return next(ApiSuccess(201,Rooms,'Total Booked Rooms'));
        
    } catch (error) {
        console.log(
            {
            'Internal Serve Error, ' : error.message,
            error
            }
        );
        // Default error
        return next(ApiError(500, `Internal Server Error: ${error.message}`)); 
    }
}

module.exports={
    BookRoom,
    getBookRoom
}