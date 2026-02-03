import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import { connectDB } from './config/db.js';

dotenv.config();

// Sample initial products (you can load from projects.json)
const sampleProducts = [
  {
    title: "Example Product 1",
    description: "This is a sample product description for testing purposes.",
    price: 99.99,
    disponible: true,
    tags: ["new", "featured"],
    images: ["https://via.placeholder.com/400"],
    date: new Date().toISOString().split('T')[0],
    contact: "contact@example.com"
  },
  {
    title: "Example Product 2",
    description: "Another sample product with different features and benefits.",
    price: 149.99,
    disponible: true,
    tags: ["premium"],
    images: ["https://via.placeholder.com/400"],
    date: new Date().toISOString().split('T')[0],
    contact: "contact@example.com"
  },
    {
    title: "Example Product 3",
    description: "Another sample product with different features and benefits.",
    price: 149.99,
    disponible: true,
    tags: ["premium"],
    images: ["https://via.placeholder.com/400"],
    date: new Date().toISOString().split('T')[0],
    contact: "contact@example.com"
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✓ Added ${createdProducts.length} sample products to database`);
    
    // Display created products
    const allProducts = await Product.find();
    console.log('\nProducts in database:');
    allProducts.forEach(p => {
      console.log(`- ${p.title} (ID: ${p._id}) - €${p.price}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
