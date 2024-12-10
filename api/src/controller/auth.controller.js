require('dotenv').config();

const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
// const secretKey=process.env.SECRET

const ApiError=require('../utils/ApiResponse/ApiError');
const ApiSuccess=require('../utils/ApiResponse/ApiSuccess');

const generateAccessToken=require('../utils/token/generateAccessToken');

// const generateRefreshToken=require('../utils/middleware/token/generateRefreshToken');

const validatePassword=require('../utils/passwordValidation');

const Auth = require('../model/auth.model');

const SignUp=async(req,res,next)=>{
    const {firstname,lastname,email,password} = req.body;    
  
    try  
    {
        const isValidPassword=validatePassword(password)
  
        if(isValidPassword){
            const hashedPassword=bcryptjs.hashSync(password,10);
            
            const register=new Auth({
                firstname,
                lastname,
                email,
                password : hashedPassword,
                role : req.role
            })
    
            const savedData = await register.save();
            const data = savedData.toObject();
            delete data.password;
            delete data.refreshToken;
            
            return next(ApiSuccess(201, data, `${firstname} ${lastname} Registered Successfully`));
        }
        else{
            return next(ApiError(400,`Enter a valid password. Atleast Min 8 Character, 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number `));
        }
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
        else if (error.code === 11000) {
              const duplicateKey = Object.keys(error.keyValue)[0];
              const duplicateValue = error.keyValue[duplicateKey];
  
              if (duplicateKey === 'email') {
                  return next(ApiError(400, `This email is already taken: ${duplicateValue}`));
              } else if (duplicateKey === 'contactNo') {
                  return next(ApiError(400, `This contact number is already taken: ${duplicateValue}`));
              } 
              // else if (duplicateKey === 'username') {
              //     return next(ApiError(400, `This username is already taken: ${duplicateValue}`));
              // }
        }
        // Default error
        return next(ApiError(500, `Internal Server Error: ${error.message}`));
     }
  }
  
  const Login=async(req,res,next)=>{
      const {email,password}=req.body;
  
      if(!email || email.trim().length === 0)
      {
          return next(ApiError(400,`Email field is required`))
      }
      else if(!password || password.trim().length === 0)
      {
          return next(ApiError(400,`Password field is required`))   
      }
  
      let existingEmail;
      try {
           existingEmail = await Auth.findOne({email})
           if(!existingEmail){
              return next(ApiError(400,`${email} email don't Exist. Either Enter a correct one or Register Yourself with this email.`))
           }
           else if(existingEmail.role !== req.role)
           {
              return next(ApiError(400,`email ${email} is not assigned with ${req.role} role`))
           }
           else
           {
              const checkPassword=bcryptjs.compareSync(password,existingEmail.password)
              if (!checkPassword) {
                return next(ApiError(400,`Wrong Password, Try Again`))
                } 
              else {
                 const accessToken = await generateAccessToken(existingEmail._id);
   
                //  const refreshToken=await generateRefreshToken(existingEmail._id);
   
                 const loggedIn=await Auth.findById(existingEmail._id).select("-password");
   
              return next(ApiSuccess(200,{user:loggedIn,accessToken},`${req.role} Logged In Successfully`))
              }
          }
         }
      catch(error)
      {
          console.log({
             'Internal Serve Error, ' : error.message,
              error
              });
          
          return next(ApiError(500,`${error.message}, ${error.stack}`));
      }
  
  }
  

// const adminUpdate=async(req,res)=>
// {
//     if(req.user.id !== req.params.adminId )   
//     {
//        return res.status(400).json('Unauthorized User. You are not allowed to update')
//     } 
//     if(req.body.password){
//         const isValidPassword = validatePassword(req.body.password)
//         if(isValidPassword)
//         {
//             req.body.password = bcryptjs.hashSync(req.body.password,10)
//         }
//         else{
//             return res.status(400).json('Enter A Valid Password')
//         }
//     }
//     try {
//         const updateAdmin= await Admins.findByIdAndUpdate(req.params.adminId,{
//             $set:{
//                 firstname:req.body.firstname,
//                 lastname:req.body.lastname,
//                 username: req.body.username,
//                 email: req.body.email,
//                 profilePicture: req.body.profilePicture,
//                 password:req.body.password,
//             },
//         },
//         {new: true}
//         );
//         const {password, ...rest} = updateAdmin._doc;
//         return res.status(201).json(rest);
//     } catch (error) {
//         return res.status(400).json(error)
//     }
// }


// const productDetail=async(req,res)=>{ 

//   if(req.user.id !== req.params.adminId)
//   {
//     return res.status(400).json('Unauthorized User. You are not allowed to upload products')
//   }
//   else
//   {
//    const {name,discountPrice,actualPrice,category,theme,character,tags,color,style,material,about,length,width,height}=req.body;

//     try{
//         const product=new products({
//             name,
//             discountPrice,
//             actualPrice,
//             category,
//             tags,
//             description: {
//               theme,
//               character,
//               color,
//               style,
//               material,
//               size:{
//                 length,width,height
//               },
//               about,
//             }
//         });
//         const item=await product.save();
//         return res.status(201).json(item)
//     }catch(error){
//         return res.status(500).json({error})
//     }
//   }  
// }




module.exports={
    SignUp,
    Login,
    // adminUpdate,
    // productDetail,
    // homeStay
}