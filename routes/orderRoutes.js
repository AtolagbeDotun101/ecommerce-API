const {
    getAllOrders, getSingleOrder, getCurrentUserOrders,
  createOrder, updateOrder
} = require('../controllr/orderController')
const express = require('express')
const Router = express.Router()
const {
  authenticateUser,
  unAuthorized,
} = require("../middleware/authentication");

Router.route('/').post(authenticateUser, createOrder).get(authenticateUser, unAuthorized('Admin'), getAllOrders)

Router.route('/showAllMyOrders').get(authenticateUser, getCurrentUserOrders)

Router.route('/:id').get(authenticateUser,getSingleOrder).patch(authenticateUser, updateOrder)


module.exports = Router