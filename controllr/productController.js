const Product = require('../model/product')
const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')
const path = require('path')


const createProduct = async (req, res) => {
   req.body.user = req.user.userId
    const product =await Product.create(req.body)
    res.status(StatusCodes.CREATED).json(product)
}


const getAllProducts = async (req, res) => {
    const products = await Product.find({}).populate('review')
    res.status(StatusCodes.OK).json({products, count:products.length})
}


const getSingleProduct = async (req, res) => {

    const {id:productId} = req.params
    const product = await Product.findOne({_id:productId})
    if (!product) {
    throw new customError.NotFoundError(`There is no product with id: ${productId}`)
    }
    res.status(StatusCodes.OK).json(product)
    
}

const updateProduct = async (req, res) => {
    const { id: productId } = req.params
    const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
        new: true,
        runValidators:true
    } )
 if (!product) {
    throw new customError.NotFoundError(`There is no product with id: ${productId}`)
    }
    res.status(StatusCodes.OK).json(product)
}

const deleteProduct = async (req, res) => {
    const { id: productId } = req.params
    const product = await Product.findOne({ _id: productId })
 if (!product) {
    throw new customError.NotFoundError(`There is no product with id: ${productId}`)
    }

    await product.remove()
    res.status(StatusCodes.OK).send('deleted succesfully')
}


const uploadImage = async (req, res) => {

    // console.log(req.file)
    const productImage = await Product.create(req.file)
    if (!productImage) {
        throw new customError.BadRequestError('upload image')
    }
    const productFile = req.file.image

    if (!productFile.mimetype.startsWith('image')) {
        throw new customError.BadRequestError('images only !')
    }
    const maxSize = 1024 * 1024

    if (productFile.size > maxSize) {
        throw new customError.BadRequestError('image size must not exceed 1MB')
    }

    const imagePath = path.join(__dirname, '../uploads' + `${productFile.name}`)
    await productFile.mv(imagePath)

    res.status(StatusCodes.CREATED).json({image: `../uploads/${productFile.name}`})
}

module.exports = {
    createProduct, getAllProducts,
  getSingleProduct, updateProduct, deleteProduct, uploadImage
}