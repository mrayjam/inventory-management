import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';


dotenv.config();

const seedData = async () => {
  try {
    
    await connectDatabase();

    
    await User.deleteMany({});
    await Product.deleteMany({});
    await Supplier.deleteMany({});
    console.log('Cleared existing data');

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'admin'
      },
      {
        name: 'Super Admin',
        email: 'superadmin@example.com', 
        password: bcrypt.hashSync('password123', 10),
        role: 'super_admin'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'admin'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'admin'
      }
    ];

    await User.insertMany(users);
    console.log('✅ Users seeded (passwords hashed)');

    const suppliers = [
      {
        name: 'TechCorp Solutions',
        email: 'contact@techcorp.com',
        phone: '+1 (555) 123-4567',
        address: '123 Tech Street, Silicon Valley, CA 94000',
        category: 'Electronics',
        status: 'Active'
      },
      {
        name: 'FashionHub Inc',
        email: 'orders@fashionhub.com',
        phone: '+1 (555) 234-5678',
        address: '456 Fashion Ave, New York, NY 10001',
        category: 'Clothing',
        status: 'Active'
      },
      {
        name: 'BookWorld Publishing',
        email: 'sales@bookworld.com',
        phone: '+1 (555) 345-6789',
        address: '789 Literature Blvd, Boston, MA 02101',
        category: 'Books',
        status: 'Inactive'
      },
      {
        name: 'GreenThumb Gardens',
        email: 'info@greenthumb.com',
        phone: '+1 (555) 456-7890',
        address: '321 Garden Way, Portland, OR 97201',
        category: 'Home & Garden',
        status: 'Active'
      }
    ];

    await Supplier.insertMany(suppliers);
    console.log('✅ Suppliers seeded');

    const products = [
      {
        name: 'Wireless Headphones',
        category: 'Electronics',
        price: 99.99,
        stock: 45,
        supplier: 'TechCorp',
        sku: 'WH-001',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        description: 'Premium wireless headphones with noise cancellation and 30-hour battery life'
      },
      {
        name: 'Cotton T-Shirt',
        category: 'Clothing',
        price: 24.99,
        stock: 120,
        supplier: 'FashionHub',
        sku: 'CT-002',
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
        description: '100% organic cotton t-shirt, available in multiple colors and sizes'
      },
      {
        name: 'Programming Guide',
        category: 'Books',
        price: 49.99,
        stock: 8,
        supplier: 'BookWorld',
        sku: 'PG-003',
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300',
        description: 'Comprehensive guide to modern programming practices and design patterns'
      },
      {
        name: 'Garden Tools Set',
        category: 'Home & Garden',
        price: 159.99,
        stock: 25,
        supplier: 'GreenThumb',
        sku: 'GT-004',
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300',
        description: 'Professional 5-piece garden tools set with ergonomic handles and carrying case'
      }
    ];

    await Product.insertMany(products);
    console.log('✅ Products seeded');

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Default login credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Super Admin: superadmin@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
