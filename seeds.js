const mongoose = require('mongoose');

/* Models */
const Product = require('./models/product');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/shop_db').then((result) => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

// Seed data
const seedProducts = [
    {
        name: 'Uniqlo Airisim Black T-Shirt',
        brand: 'Uniqlo',
        price: 100000,
        color: 'Black',
        category: 'T-Shirt'
    },
    {
        name: 'Uniqlo Airisim White T-Shirt',
        brand: 'Uniqlo',
        price: 150000,
        color: 'White',
        category: 'T-Shirt'
    },
    {
        name: 'Uniqlo Chino Pants',
        brand: 'Uniqlo',
        price: 250000,
        color: 'Navy',
        category: 'Pants'
    },
    {
        name: 'Uniqlo Polo Shirt',
        brand: 'Uniqlo',
        price: 200000,
        color: 'Blue',
        category: 'Shirt'
    },
    {
        name: 'Uniqlo Socks',
        brand: 'Uniqlo',
        price: 50000,
        color: 'Black',
        category: 'Socks'
    },
    {
        name: 'Uniqlo Hoodie',
        brand: 'Uniqlo',
        price: 300000,
        color: 'Gray',
        category: 'Hoodie'
    },
    {
        name: 'Uniqlo Jeans',
        brand: 'Uniqlo',
        price: 350000,
        color: 'Black',
        category: 'Jeans'
    },
    {
        name: 'Uniqlo Dress',
        brand: 'Uniqlo',
        price: 400000,
        color: 'Red',
        category: 'Dress'
    },
    {
        name: 'Uniqlo Shorts',
        brand: 'Uniqlo',
        price: 150000,
        color: 'Khaki',
        category: 'Shorts'
    },
    {
        name: 'Uniqlo Sweater',
        brand: 'Uniqlo',
        price: 250000,
        color: 'Navy',
        category: 'Sweater'
    }
]

// Delete all existing data first
Product.deleteMany({}).then((result) => {
    console.log('Refreshing database...');
}).catch((err) => {
    console.log(err);
});

Product.insertMany(seedProducts).then((result) => {
    console.log('Seed data inserted successfully');
    console.log(result);
}).catch((err) => {
    console.log(err);
});