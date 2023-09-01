const mongoose = require('mongoose')

const singleOrderCartItem = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  amount: { type: String, required: true },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});



const OrderSchema = new mongoose.Schema(
  {
    tax: {
      type: String,
      required: true,
    },
    shippingFee: {
      type: String,
      required: true,
    },
    subTotal: {
      type: String,
    },
    total: {
      type: String,
      required: true,
    },
        orderItems: [singleOrderCartItem],
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'cancelled', 'delivered'],
            default:'pending'
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model('Order', OrderSchema)