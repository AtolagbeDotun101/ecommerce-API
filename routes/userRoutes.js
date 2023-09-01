const { getAllUser, getSingleUser, showCurrentUser, updateUser, updateUserPassword } = require('../controllr/userController')
const {authenticateUser, unAuthorized   } = require('../middleware/authentication')
const express = require('express')
const Router = express.Router()

Router.route('/').get(authenticateUser,unAuthorized('Admin'),getAllUser)

Router.route('/showMe').get(authenticateUser,showCurrentUser)
Router.route('/updateUser').patch(authenticateUser,updateUser)
Router.route('/updateUserPassword').patch(authenticateUser, updateUserPassword)

Router.route('/:id').get(authenticateUser,getSingleUser)

module.exports= Router