const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  // Mongoose automatically adds an _id field of type ObjectId
  paymentid: {
    type: String,
    required: true  ,// Assuming this field should be required
    default: "pending"
  },
  orderid: {
    type: String,
    required: true  // Assuming this field should be required
  },
  status: {
    type: String,
    required: true  // Assuming this field should be required
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, 
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
