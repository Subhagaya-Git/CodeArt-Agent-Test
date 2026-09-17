require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');

const seed = async () => {
  await connectDB();
  await User.deleteMany({});
  await Product.deleteMany({});

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@shop.com',
    password: 'admin123',
    role: 'admin',
  });
  const user = await User.create({
    name: 'Test User',
    email: 'user@shop.com',
    password: 'user123',
    role: 'user',
  });

  const products = [
    { name: 'Wireless Headphones', description: 'Noise-cancelling over-ear headphones with 30h battery.', price: 129.99, stock: 25, category: 'electronics', image_url: 'https://picsum.photos/seed/headphones/600/600' },
    { name: 'Bluetooth Speaker', description: 'Portable waterproof speaker with deep bass.', price: 49.99, stock: 40, category: 'electronics', image_url: 'https://picsum.photos/seed/speaker/600/600' },
    { name: 'Smart Watch', description: 'Fitness tracking, heart rate, notifications.', price: 199.99, stock: 15, category: 'electronics', image_url: 'https://picsum.photos/seed/watch/600/600' },
    { name: 'Cotton T-Shirt', description: 'Soft breathable cotton crew neck tee.', price: 19.99, stock: 100, category: 'clothing', image_url: 'https://picsum.photos/seed/tshirt/600/600' },
    { name: 'Denim Jeans', description: 'Slim fit stretch denim jeans.', price: 59.99, stock: 60, category: 'clothing', image_url: 'https://picsum.photos/seed/jeans/600/600' },
    { name: 'Running Shoes', description: 'Lightweight running shoes with cushioned sole.', price: 89.99, stock: 30, category: 'clothing', image_url: 'https://picsum.photos/seed/shoes/600/600' },
    { name: 'Coffee Mug', description: 'Ceramic 12oz mug, dishwasher safe.', price: 9.99, stock: 200, category: 'home', image_url: 'https://picsum.photos/seed/mug/600/600' },
    { name: 'Desk Lamp', description: 'LED adjustable desk lamp with USB port.', price: 34.99, stock: 45, category: 'home', image_url: 'https://picsum.photos/seed/lamp/600/600' },
    { name: 'Backpack', description: 'Water-resistant laptop backpack 25L.', price: 44.99, stock: 70, category: 'accessories', image_url: 'https://picsum.photos/seed/backpack/600/600' },
    { name: 'Sunglasses', description: 'UV400 polarized sunglasses.', price: 24.99, stock: 80, category: 'accessories', image_url: 'https://picsum.photos/seed/sunglasses/600/600' },
    { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with blue switches.', price: 79.99, stock: 20, category: 'electronics', image_url: 'https://picsum.photos/seed/keyboard/600/600' },
    { name: 'Yoga Mat', description: 'Non-slip eco-friendly yoga mat 6mm.', price: 29.99, stock: 55, category: 'home', image_url: 'https://picsum.photos/seed/yogamat/600/600' },
  ];
  await Product.insertMany(products);

  console.log('Seed complete!');
  console.log('Admin: admin@shop.com / admin123');
  console.log('User:  user@shop.com / user123');
  await disconnectDB();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});