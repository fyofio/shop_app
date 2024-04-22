const mongoose = require("mongoose");

const Product = require("./product");

const garmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name cannot be empty!"],
  },
  location: {
    type: String,
  },
  contact: {
    type: String,
    required: [true, "Contact cannot be empty!"],
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

garmentSchema.post("findOneAndDelete", async function (garment) {
  if (garment.products.length) {
    const res = await Product.deleteMany({ _id: { $in: garment.products } });
    console.log(res);
  }
});

const Garment = mongoose.model("Garment", garmentSchema);

module.exports = Garment; // Export the Garment model
