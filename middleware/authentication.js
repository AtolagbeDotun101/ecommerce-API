const customError = require('../errors')
const  {verifyToken} = require('../utils')
const jwt = require('jsonwebtoken')



const authenticateUser = async (req, res, next) => {
    const token = req.signedCookies.token
    // console.log(token);
    if (!token) {
        throw new customError.UnauthenticatedError('invalid authentication')
    }

    try {
        const {name, userId,role} = verifyToken({token})
        // let {name, userId,role} = payload.user
        // console.log(token);
        req.user = { name, userId, role }
        console.log(role);
      
        next()
    } catch (error) {
    //   throw new customError.UnauthenticatedError('invalid authentication')  ;
    console.log(error);
    }
}


const unAuthorized = (...roles) => {
    return (req, res, next) => {
        
        if (!roles.includes(req.user.role)){
            throw new customError.unAuthorizedError('unauthorized to access this route')
        }
        next()
    }
}


// const adminOnly = (req, res, next) => {
//     const token = req.signedCookies.token
//     const payload = verifyToken({ token })
//     console.log(payload);
//     if (!payload.role == "Admin") {
//          throw new customError.unAuthorizedError('unauthorized to access this route')
//     }
// next()
// }


module.exports = {authenticateUser, unAuthorized,}