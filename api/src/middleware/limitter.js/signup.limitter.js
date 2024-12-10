const limitter=require('express-rate-limit')

const signupLimitter=limitter({
    windowMs: 5 * 60 * 1000,
    max: 5,
    keyGenerator: (req) => {
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      },
    message:{
        code:429,
        message:"Too many Registration Request. Try after sometime"
    }
 }
)

module.exports=signupLimitter