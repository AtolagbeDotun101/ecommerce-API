const {
    createReview,getAllReview,getSingleReview,updateReview,deleteReview
} = require('../controllr/reviewController')

const express = require('express')
const Router = express.Router()
const {authenticateUser, unAuthorized} = require('../middleware/authentication')


Router.route('/').get(getAllReview).post(authenticateUser,  createReview)

Router.route('/:id').get(authenticateUser, getSingleReview).patch(authenticateUser, updateReview).delete(authenticateUser, deleteReview)






module.exports = Router