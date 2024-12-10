const mongoose=require('mongoose')
const validator=require('validator')

const authSchema=new mongoose.Schema(
    {
        firstname: {
            type:String,
            required:[true,'Firstname is require'],
            trim:true,
        },        
        lastname: {
            type:String,
            required:[true,'Lastname is required'],
            trim:true
        },
        // username: {
        //     type:String,
        //     required:[true,'Username field is required'],
        //     trim:true,
        //     unique:true,
        // },
        email:{
            type:String,
            required:[true,'Email field is required'],
            trim:true,
            unique:true,
            validate:{
                validator(value){
                    if(!validator.isEmail(value)){
                        throw new Error("Write a Valid Email")
                    }    
                } 
            }
        },
        password:{
            type:String,
            required:[true,'Password Field is required'],
        },
        profilePicture:{
            type:String,
            default:'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        },
        role:{
            type:String,
            enum: {
                values: ['ADMIN','USER'],
                message: '{VALUE} is not a valid for Role.'
            },
            // required:[true,'Role Field is required']
        }
    },
)

const Auth= mongoose.model('Auth',
authSchema)

module.exports= Auth;
