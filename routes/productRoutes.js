const express = require('express')
const Router = express.Router()
const {authenticateUser, unAuthorized} = require('../middleware/authentication')
const  {
    createProduct, getAllProducts,
  getSingleProduct, updateProduct, deleteProduct, uploadImage
} = require('../controllr/productController')


Router.route('/').post([authenticateUser,unAuthorized('Admin')], createProduct).get(getAllProducts)

Router.route('/uploadImage').post([authenticateUser,unAuthorized('Admin')], uploadImage)

Router.route('/:id').get(getSingleProduct).patch( [authenticateUser,unAuthorized('Admin')],updateProduct).delete([authenticateUser,unAuthorized('Admin')], deleteProduct)




module.exports = Router