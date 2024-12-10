const express=require('express')

const router=express.Router()

const auth=require('../controller/auth.controller')
const defineRole=require('../middleware/role/defineRole');
const verifyRole=require('../middleware/role/verifyRole')
const loginLimitter=require('../middleware/limitter.js/login.limitter')
const signupLimitter=require('../middleware/limitter.js/signup.limitter')
 

router.post('/Admin/Signup',defineRole('ADMIN'),signupLimitter,auth.SignUp)
router.post('/Admin/Login',verifyRole('ADMIN'),loginLimitter,auth.Login)


module.exports=router