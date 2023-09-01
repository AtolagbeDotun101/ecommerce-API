const Review = require('../model/review');
const Product = require('../model/product')
const { StatusCodes } = require('http-status-codes')
const customError = require('../errors')
const {checkPermission} = require('../utils')

const createReview = async (req, res) => {
    const {product : productId} = req.body
    
    const validProduct = await Product.findOne({_id: productId })
    if (!validProduct) {
        throw new customError.NotFoundError('No product with such ID')
    }

    const checkReview = await Review.findOne({
        product: productId,
        user: req.user.userId
    })
    
    if (checkReview) {
        throw new customError.BadRequestError("Review exist, Can't make more than one review")
    }

     req.body.user = req.user.userId
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({review})
}

const getAllReview = async (req, res) => {

    const reviews = await Review.find({}).populate({path:'user', select:'name price company'})
    res.status(StatusCodes.OK).json({reviews, count:reviews.length})
} 

const getSingleReview = async (req, res) => {
    const { id: reviewId } = req.params
    
    const review = await Review.findById({_id:reviewId}).populate({path:'user', select:'name price company'})
    
     if (!review) {
       throw new customError.NotFoundError(`No review with ID ${reviewId}`);
    }
    
    res.status(StatusCodes.OK).json({review})
}

const updateReview = async (req, res) => {
    const { id: reviewId } = req.params
    const { title, comment, rating } = req.body
    
    const review = await Review.findOne({ _id: reviewId })
    if (!review) {
      throw new customError.NotFoundError(`No review with ID ${reviewId}`);
    }

    checkPermission(req.user, review.user);
    review.title = title;
    review.comment = comment;
    review.rating = rating;
    await review.save()

    res.status(StatusCodes.OK).json({review});
}

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params

    const review = await Review.findOne({ _id: reviewId })
    if (!review) {
        throw new customError.NotFoundError(`No review with ID ${reviewId}`)
    }

    checkPermission(req.user, review.user)
    await review.remove()

    res.status(StatusCodes.OK).json({msg: 'review deleted succesfully'})
}

const getSingleProductReviews = async (req, res) => {
    const { product: productId } = req.params
    const productReview = await Review.find({_id:productId})
}

module.exports = {
    createReview,getAllReview,getSingleReview,updateReview,deleteReview,getSingleProductReviews
}