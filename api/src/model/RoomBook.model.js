const mongoose = require('mongoose')
const validator = require('validator')

const guestSchema= new mongoose.Schema(
    {
        GuestName:{
            type:String,
            required:[true,'Guest name is required']
        },
        GuestContact:{
            type:String,
            required:[true,'Guest Contact is required']
        },
        GuestIdentity:{
            type:String,
            enum: {
                values: ['AADHAR','PANCARD','DL','PASSPORT'],
                message: '{VALUE} is not a valid for Guest Identity.'
            },  
            required:[true,'Guest Identity is required']
        },
        IdentityNo:{
            type:String,
            required:[true,'Identity Number is required']
        }       
    }
)

const RoomBookSchema=new mongoose.Schema(
    {
        RoomID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'rooms',
            required:[true,'Room ID is required']
        },
        BookingName:{
            type:String,
            required:[true,'Booking Name is required'],
        },    
        BookingContact:{
            type:String,
            required:[true,'Booking Contact is required'],
        },
       CheckIn: {
            type: Date,
            required: [true, 'Check In Time is required'],
            validate: {
                validator: function (value) {
                    // Ensure CheckIn date is not in the past
                    return value >= new Date();
                },
                message: 'Check In date must be today or a future date.',
            },
        },
        CheckOut:{
            type: Date,
            required:[true,'Check Out Time is required'],
            validate: {
                    validator: function (value) {
                        // Check if CheckIn date is before CheckOut date
                        return this.CheckIn < value;
                    },
                    message: 'CheckOut date must be later than CheckIn date',
                },        
        },
        OldData:{
            type:Boolean,
            default:false
        },
        // amount:{}
        payment:{
            type:String
        },
        Guests:{
            type:[guestSchema],
            validate:
            {
                validator:function(v){
                    return v && v.length>0;
                },
                message:'Please provide Guest Information',
            }
        }
})

const RoomBook= mongoose.model('RoomBook',RoomBookSchema)

module.exports=RoomBook;