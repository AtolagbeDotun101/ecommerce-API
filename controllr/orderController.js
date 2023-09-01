const Product = require('../model/product');
const { StatusCodes } = require('http-status-codes');
const checkPermission = require('../utils/checkPermission')
const customError = require('../errors');
const Order = require('../model/order');

const getAllOrders = async (req, res) => {
    const order = await Order.find({})
    res.status(StatusCodes.OK).json({order})
}

const getSingleOrder = async (req, res) => {
    const {id: orderId } = req.params
    const order = await Order.findById({_id:orderId})
  res.status(StatusCodes.OK).json({order});
};

const getCurrentUserOrders = async (req, res) => {
    const order = await Order.find({user: req.user.userId})
  res.status(StatusCodes.OK).json({order, count:order.length});
};


// fake stripe API 
const fakeStripeAPI = async ({amount, currency}) => {
    client_secret = 'randomSecret'
    return {amount, client_secret}
}

const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body
    if (!cartItems || cartItems < 1) {
        throw new customError.BadRequestError('provide items')
    }

    if (!tax || !shippingFee) {
      throw new customError.BadRequestError("provide value for tax and shipping fee");
    }
    let orderItems = []
    let subtotal = 0

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({ _id: item.product })
        console.log(dbProduct);
        if (!dbProduct) {
            throw new customError.NotFoundError(`No product with id:${item.product}`)
        }

        const { name, price, image, _id } = dbProduct
        const singleOrder = {
            amount: item.amount,
            name, price, image, product: _id
        }
        //add items in order
        orderItems = [...orderItems, singleOrder]
        //add price
        subtotal += item.amount * price
    }
        // total fee
        const total = tax + shippingFee + subtotal
    
        const paymentIntent = await fakeStripeAPI({ amount: total, currency:'usd' })
        
   
    
     const order = await Order.create({
       orderItems,
       subtotal,
       total,
       clientSecret: paymentIntent.client_secret,
       tax,
       shippingFee,
       user: req.user.userId,
     });
  res.status().json({order, clientSecret: order.clientSecret});
};

const updateOrder = async (req, res) => {
    const { id: orderId } = req.params
    const { paymentIntentId } = req.body
    
    const order = await Order.findOne({ _id: orderId })
    if (!order) {
        throw new customError.BadRequestError(`No order with id:${orderId}`)
    }
    checkPermission(req.user, order.user)
    order.paymentIntentId = paymentIntentId
    order.status = 'paid'

    order.save()

  res.status(StatusCodes.OK).json({order});
};

module.exports = {
    getAllOrders, getSingleOrder, getCurrentUserOrders,
  createOrder, updateOrder
}