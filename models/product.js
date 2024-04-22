const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "T-Shirt",
      "Shirt",
      "Pants",
      "Socks",
      "Hoodie",
      "Jeans",
      "Dress",
      "Shorts",
      "Sweater",
    ],
    required: true,
  },
  garment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Garment",
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product; // Export the Product model
