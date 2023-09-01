const User = require('../model/user')
const {StatusCodes} = require('http-status-codes')
const customError = require('../errors')
const {attachCookiesResponse, createTokenUser} = require('../utils')


const register = async (req, res) => {
    const { name, email, password } = req.body
    const emailExist = await User.findOne({email})
    if (emailExist) {
        throw new customError.BadRequestError('Email already exist')
    }

    const firtsUser = (await User.countDocuments({})) === 0 
    const role = firtsUser? 'Admin' : 'User'

    const user = await User.create({ name, email, password, role })
    const tokenUser = createTokenUser(user)
    console.log(tokenUser);
    attachCookiesResponse({res, user:tokenUser})
    res.status(StatusCodes.CREATED).json({user:tokenUser})
}

const login = async (req, res) => {
    const { email, password } = req.body
    
    if (!email && !password) {
        throw new customError.BadRequestError('Input credentials')
    }


    const user = await User.findOne({email})
    if (!user) {
        throw new customError.UnauthenticatedError('Invalid email address')
    }

    const correctPassword = user.comparePassword(password)
    if (!correctPassword) {
        throw new customError.UnauthenticatedError('Incorrect Password')
    }

    const tokenUser = createTokenUser(user)
    // console.log(tokenUser);
     attachCookiesResponse({res,user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
}

const logout = async (req, res) => {
    res.cookie('logout', 'logout', {expires: new Date(Date.now())})
    res.status(StatusCodes.OK).send('user logged')
}



module.exports = {register,login,logout}