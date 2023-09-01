const CustomError = require('../errors')

const checkPermission = (requestUser, resourceUserId) => {
    
    // console.log(resourceUserId);
    // console.log(requestUser);

     if (requestUser.role === 'Admin') return;
     if (requestUser.userId === resourceUserId.toString()) return;
 throw new CustomError.unAuthorizedError('unauthorized to acess this route')

}

module.exports = checkPermission