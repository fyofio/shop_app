const path = require("path");
const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const app = express();
const ErrorHandler = require("./utils/ErrorHandler");

/* Models */
const Product = require("./models/product");
const Garment = require("./models/garment");
const { wrap } = require("module");

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1/shop_db")
  .then((result) => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // Middleware for parsing form data
app.use(methodOverride("_method"));

// function wrapAsync(fn) {
//     return async (req, res, next) => {
//         try {
//             await fn(req, res, next);
//         } catch (error) {
//             // next(new ErrorHandler('Product not Found!', 404));
//             next(error);
//         };
//     };
// };

// Alternative wrapAsync function
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get(
  "/garments",
  wrapAsync(async (req, res) => {
    const garments = await Garment.find({});
    res.render("garment/index", { garments });
  })
);

app.get("/garments/create", (req, res) => {
  res.render("garment/create");
});

app.post(
  "/garments",
  wrapAsync(async (req, res) => {
    const garment = new Garment(req.body);
    await garment.save();
    res.redirect(`/garments`);
  })
);

app.get(
  "/garments/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const garment = await Garment.findById(id).populate("products");
    res.render("garment/show", { garment });
  })
);

//garments/:garment_id/products/create
app.get("/garments/:garment_id/products/create", (req, res) => {
  const { garment_id } = req.params;
  res.render("products/create", { garment_id });
});

//garments/:garment_id/products/
app.post(
  "/garments/:garment_id/products",
  wrapAsync(async (req, res) => {
    const { garment_id } = req.params;
    const garment = await Garment.findById(garment_id);
    const product = new Product(req.body);

    // console.log(product);
    // console.log(garment_id);

    garment.products.push(product);
    product.garment = garment;

    await garment.save();
    await product.save();
    console.log(garment);

    // Redirect to the garment page
    res.redirect(`/garments/${garment_id}`);
  })
);

app.delete(
  "/garments/:garment_id/",
  wrapAsync(async (req, res) => {
    const { garment_id } = req.params;
    await Garment.findOneAndDelete({ _id: garment_id });
    res.redirect("/garments");
  })
);

app.get("/products", async (req, res) => {
  const { category } = req.query;
  if (category) {
    const products = await Product.find({ category });
    res.render("products/index", { products, category });
  } else {
    const products = await Product.find({});
    // console.log(products);
    res.render("products/index", { products, category: "All" });
  }
});

app.get("/products/create", (req, res) => {
  res.render("products/create");
});

app.post("/products", async (req, res) => {
  const product = new Product(req.body); // _id already generated here
  await product.save();
  res.redirect(`/products/${product._id}`);
});

// Without error handling
// app.get('/products/:id', async (req, res) => {
//     const product = await Product.findById(req.params.id);
//     res.render('products/show', { product });
// });

// With error handling
// app.get('/products/:id', async (req, res, next) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         res.render('products/show', { product });
//     } catch (error) {
//         next(new ErrorHandler('Product not found', 404));
//     }
// });

// With error handling + Function wrapper
app.get(
  "/products/:id",
  wrapAsync(async (req, res) => {
    const product = await Product.findById(req.params.id).populate("garment");
    res.render("products/show", { product });
  })
);

// Without wrapAsync function
// app.get('/products/:id/edit', async (req, res, next) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         res.render('products/edit', { product });
//     } catch (error) {
//         next(new ErrorHandler('Product not found', 404));
//     };
// });

// With wrapAsync function
app.get(
  "/products/:id/edit",
  wrapAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    res.render("products/edit", { product });
  })
);

// Without wrapAsync function
// app.put('/products/:id', async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
//         res.redirect(`/products/${product._id}`);
//     } catch (error) {
//         next(new ErrorHandler('Cannot find this ID in database', 412));
//     };
// });

// With wrapAsync function
app.put(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/products/${product._id}`);
  })
);

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.redirect("/products");
});

// Middleware error, for logging
app.use((err, req, res, next) => {
  // Use elsif for multiple error handling
  if (err.name === "ValidationError") {
    err.status = 400;
    err.message = Object.values(err.errors).map((item) => item.message);
  } else if (err.name === "CastError") {
    err.status = 404;
    err.message = "Product not found";
  }
  next(err); // Send it to the next middleware
});

// Middleware error, send the error message
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});

app.listen(3000, () => {
  console.log("Shop app listening on http://127.0.0.1:3000");
});
