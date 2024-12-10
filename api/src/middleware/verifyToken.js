// require('dotenv').config();
const jwt=require('jsonwebtoken');
const secretKey=process.env.SECRET
const ApiError=require('../utils/ApiResponse/ApiError');

// const verify=(req,res,next)=>{
//     // const authHeader = req.headers['authorization'];
//     // const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
//     try {
//         const token = req.cookies?.accessToken || req.headers['authorization']?.replace("Bearer ","");        

//         if(!token)
//         {
//              return next(ApiError(401,'Unauthorized User, No Token Found'));
//         }
//         jwt.verify(token, 'k95k9878vomaacw8qk4pbxkme0yihht-dl4pic5dtmj099dz89mklrohvs522rsxej', (err,user)=>{
//             if(err){
//                 if (err.name === 'TokenExpiredError') {
//                     return next(ApiError(401, 'Unauthorized User, Token has Expired'));
//                 }
//                 return next(ApiError(401,`Unauthorized User, Token Don't Matches ${err.message}`));
//             }
//             req.user=user;
//             // console.log(user);
            
//             next();
//         })
    
//     } catch (error) {
//         res.status(500).json({error})   
//     }
// }

const verify = (role=[]) => {
    return (req, res, next) => {        
        try 
        {
            // Extract token from cookies or headers
            const token = req.cookies?.accessToken || req.headers['authorization']?.replace("Bearer ", "");

            if (!token) {
                return next(ApiError(401, `No Token Found, ${role} token Required`));
            }

            // Verify the token
            jwt.verify(token,secretKey, (err, user) => 
            {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        return next(ApiError(401, "Token has expired. Please login again."));
                    } 
                    else if (err.name === 'JsonWebTokenError') {
                        return next(ApiError(401, `Invalid token.${err.message} `));
                    }else if (err.name === "NotBeforeError") {
                        return next(ApiError(401, `Error: Token not yet valid, ${err.message}, ${err.date} `));                 
                    }
                    else {
                        return next(ApiError(401, `Unknown error occurred with JWT:", ${err.message}`));
                    }
                }
                
                req.user = user;

                const userRole = req.user.role;                
                
                if (role.includes(userRole)) 
                {
                    next();
                } 
                else {
                    return next(ApiError(403, 'Access denied: You do not have the required role.'));
                }
                // next(); // Call next to proceed to the route handler
            });
            
        } catch (error) {
            console.log({
                'Internal Serve Error, ' : error.message,
                 error
                 });
             
             return next(ApiError(500,`${error.message}, ${error.stack}`));
        }
    };
};

module.exports={
    verify
}