const jwt=require('jsonwebtoken');
const register = require('../../../model/register.model');

const generateRefreshToken=async(id)=>{
    try {
        const user=await register.findById(id);
        if (!user) 
        {
            throw new Error('User not found');
        }
        const refreshToken= jwt.sign(
            {
                id:user._id,
                role:user.role
            },'jw7ch9kz1uzybyoji5eheu6ublhcx9af-thz240q7xnxqs9o1hhhj233j7lutdkz',{
            expiresIn:"10d",
        });

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false})

        return refreshToken
    } catch (error) {
        throw new Error(`Something went wrong while generating access token. Error: ${error.message}`);
    }
}
module.exports=generateRefreshToken 