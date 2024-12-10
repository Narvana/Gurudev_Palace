const limitter=require('express-rate-limit')

const loginLimitter=limitter({
    windowMs: 1 * 60 * 2000,
    max : 5,
    keyGenerator: (req) => {
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      },
    message:{ 
        code: 429,
        message:" Too mamy login Request. Try after sometime"
    }
 }
)

module.exports = loginLimitter