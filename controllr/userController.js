const User = require('../model/user')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const {createTokenUser, attachCookiesResponse, checkPermission} = require('../utils') 


const getAllUser = async (req, res) => {
    console.log(req.user);
    const users = await User.find({role:'User'}).select('-password')

    res.status(StatusCodes.OK).json({users})
}


const getSingleUser = async (req, res) => {
    const userId = req.params.id
    
    const user = await User.findById({ _id: userId }).select('-password')
    
    if (!user) {
        throw new CustomError.BadRequestError(`no user with id:${userId}`)
    }
    checkPermission(req.user,user._id )
   res.status(StatusCodes.OK).json({user})
}


const showCurrentUser = async (req, res) => {
    res.status(StatusCodes.OK).json({user:req.user})
}


const updateUser = async (req, res) => {
    const { name, email } = req.body
    if (!name || !email) {
        throw new CustomError.BadRequestError('input all value')
    }

    // const user = User.findOneAndUpdate({ _id: req.user.userId,},{name,email},{new:true, runValidators:true})
    const user = User.findOne({ _id: req.user.userId })
    user.name = name
    user.email = email

    await user.save()

    const tokenUser = createTokenUser(user)
    attachCookiesResponse({res, user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}


const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Input credentials')
    }
   
    const user = await User.findById({_id:req.user.userId})
    const password = user.comparePassword(oldPassword)
    if (!password) {
        throw new CustomError.BadRequestError('Incorrect password')
    }

   
    user.password = newPassword
    await user.save()
    res.status(StatusCodes.OK).json({msg:'password updated'})
}


module.exports = {
    getAllUser,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword
}