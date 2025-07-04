const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  product: String,
  quantity: Number,
  price: Number,
  availableUntil: Date,
  location: String,
  groupSale: Boolean,
  Discount: Number,
  email: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
