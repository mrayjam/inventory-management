import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Supplier from '../models/Supplier.js';
import Purchase from '../models/Purchase.js';
import Sale from '../models/Sale.js';


dotenv.config();

const getDateFromToday = (daysOffset = 0) => {
  const today = new Date();
  const date = new Date(today);
  date.setDate(today.getDate() + daysOffset);
  return date;
};

const seedData = async () => {
  try {
    
    await connectDatabase();

    
    await User.deleteMany({});
    await Product.deleteMany({});
    await Supplier.deleteMany({});
    await Purchase.deleteMany({});
    await Sale.deleteMany({});
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
    console.log('Users seeded (passwords hashed)');

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

    const createdSuppliers = await Supplier.insertMany(suppliers);
    console.log('Suppliers seeded');

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

    const createdProducts = await Product.insertMany(products);
    console.log('Products seeded');

    const purchases = [
      {
        product: createdProducts[0]._id,
        productName: 'Wireless Headphones',
        productSku: 'WH-001',
        supplier: createdSuppliers[0]._id,
        supplierName: 'TechCorp Solutions',
        quantity: 50,
        unitPrice: 75.99,
        purchaseDate: getDateFromToday(0),
        createdBy: 'admin@example.com'
      },
      {
        product: createdProducts[1]._id,
        productName: 'Cotton T-Shirt',
        productSku: 'CT-002',
        supplier: createdSuppliers[1]._id,
        supplierName: 'FashionHub Inc',
        quantity: 100,
        unitPrice: 15.99,
        purchaseDate: getDateFromToday(1),
        createdBy: 'admin@example.com'
      },
      {
        product: createdProducts[2]._id,
        productName: 'Programming Guide',
        productSku: 'PG-003',
        supplier: createdSuppliers[2]._id,
        supplierName: 'BookWorld Publishing',
        quantity: 30,
        unitPrice: 35.99,
        purchaseDate: getDateFromToday(2),
        createdBy: 'john@example.com'
      },
      {
        product: createdProducts[3]._id,
        productName: 'Garden Tools Set',
        productSku: 'GT-004',
        supplier: createdSuppliers[3]._id,
        supplierName: 'GreenThumb Gardens',
        quantity: 25,
        unitPrice: 120.99,
        purchaseDate: getDateFromToday(3),
        createdBy: 'jane@example.com'
      },
      {
        product: createdProducts[0]._id,
        productName: 'Wireless Headphones',
        productSku: 'WH-001',
        supplier: createdSuppliers[0]._id,
        supplierName: 'TechCorp Solutions',
        quantity: 20,
        unitPrice: 73.99,
        purchaseDate: getDateFromToday(5),
        createdBy: 'admin@example.com'
      }
    ];

    await Purchase.insertMany(purchases);
    console.log('Purchases seeded');

    const sales = [
      {
        productId: createdProducts[0]._id,
        productName: 'Wireless Headphones',
        productSku: 'WH-001',
        quantity: 2,
        salePrice: 99.99,
        customer: 'John Smith',
        saleDate: getDateFromToday(1),
        createdBy: 'admin@example.com'
      },
      {
        productId: createdProducts[1]._id,
        productName: 'Cotton T-Shirt',
        productSku: 'CT-002',
        quantity: 5,
        salePrice: 24.99,
        customer: 'Sarah Johnson',
        saleDate: getDateFromToday(2),
        createdBy: 'admin@example.com'
      },
      {
        productId: createdProducts[0]._id,
        productName: 'Wireless Headphones',
        productSku: 'WH-001',
        quantity: 1,
        salePrice: 99.99,
        customer: 'Mike Davis',
        saleDate: getDateFromToday(3),
        createdBy: 'john@example.com'
      },
      {
        productId: createdProducts[3]._id,
        productName: 'Garden Tools Set',
        productSku: 'GT-004',
        quantity: 1,
        salePrice: 159.99,
        customer: 'Lisa Wilson',
        saleDate: getDateFromToday(4),
        createdBy: 'jane@example.com'
      },
      {
        productId: createdProducts[1]._id,
        productName: 'Cotton T-Shirt',
        productSku: 'CT-002',
        quantity: 3,
        salePrice: 24.99,
        customer: 'Emma Brown',
        saleDate: getDateFromToday(5),
        createdBy: 'admin@example.com'
      },
      {
        productId: createdProducts[2]._id,
        productName: 'Programming Guide',
        productSku: 'PG-003',
        quantity: 2,
        salePrice: 49.99,
        customer: 'David Lee',
        saleDate: getDateFromToday(6),
        createdBy: 'john@example.com'
      },
      {
        productId: createdProducts[0]._id,
        productName: 'Wireless Headphones',
        productSku: 'WH-001',
        quantity: 1,
        salePrice: 99.99,
        customer: '',
        saleDate: getDateFromToday(7),
        createdBy: 'admin@example.com'
      }
    ];

    await Sale.insertMany(sales);
    console.log('Sales seeded');

    console.log('Database seeded successfully!');
    console.log('\n📋 Default login credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Super Admin: superadmin@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
