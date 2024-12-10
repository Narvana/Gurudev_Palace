const jwt=require('jsonwebtoken');
const Auth = require('../../../model/auth.model');
// const ApiError=require('../../ApiResponse/ApiError');

const generateAccessToken=async(id)=>{
      try {
            const user = await Auth.findById(id);
    
            if (!user) 
            {
                throw new Error('User not found');
            }
    
            const accessToken = jwt.sign(
                {
                    id: user._id,
                    role: user.role,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                },
                'k95k9878vomaacw8qk4pbxkme0yihht-dl4pic5dtmj099dz89mklrohvs522rsxej',
                { expiresIn: '1d' }
            );    
            return accessToken;
        } catch (error) {
            throw new Error(`Something went wrong while generating access token. Error: ${error.message}`);
    }
}

module.exports=generateAccessToken; 