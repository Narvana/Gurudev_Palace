const mongoose = require('mongoose')
const validator=require('validator')

const roomSchema=new mongoose.Schema(
    {
        property:{
            type:String,
            enum: {
                values: ['PALACE','KUNJ'],
                message: '{VALUE} is not a valid for Property.'
            },  
            required:[true,'Property Field is required'],
        },
        roomType:{
            type:String,
            required:[true,'Room Type is required'],
        },    
        roomSize:{
            type:String,
            required:[true,'Room Size is required'],
        },
        roomNum:{
            type:Number,
            required:[true,'Room Number is required'],
            // unique:true
        },
        guestsNum:{
            type:Number,
            required:[true,'Guest Number is required'],
        },    
        roomPrice:{
            type:Number,
            required:[true,'Room Price is required'],
        },
        roomDiscountPrice:{
            type:Number,
            required:[true,'Room Price is required'],
        },
        roomAvalibility:{
            type:Boolean,
            default:true
        },
        roomAmenities: {
            type: [String],
            default: ["Basic Essentials"],
        },
        roomPictures: {
            type: [String],
            default: ["https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"],
        },
})

roomSchema.index({ property: 1, roomNum: 1 }, { unique: true });

const Room= mongoose.model('Room',roomSchema)

module.exports=Room;


