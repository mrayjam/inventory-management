import dotenv from 'dotenv';
import connectDatabase from '../config/database.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const seedAuthUsers = async () => {
  try {
    console.log('Authentication Users Seeder');
    console.log('===============================');
    
    await connectDatabase();
    console.log('Connected to MongoDB');

    console.log('Clearing existing users...');
    await User.deleteMany({});
    console.log('Cleared existing users');

    const authUsers = [
      {
        name: 'Super Admin',
        email: 'superadmin@example.com', 
        password: bcrypt.hashSync('password123', 10),
        role: 'super_admin'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('password123', 10),
        role: 'admin'
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

    console.log('👤 Creating authentication users...');
    const createdUsers = await User.insertMany(authUsers);
    
    console.log('Authentication users created successfully!');
    console.log(`📊 Total users created: ${createdUsers.length}`);
    
    console.log('\n📋 User Accounts Created:');
    console.log('========================');
    
    createdUsers.forEach((user, index) => {
      const roleEmoji = user.role === 'super_admin' ? '👑' : '👤';
      console.log(`${roleEmoji} ${user.role.toUpperCase()}: ${user.email}`);
    });
    
    console.log('\n🔑 Default Credentials:');
    console.log('=======================');
    console.log('Password for all accounts: password123');
    console.log('');
    console.log('🎯 Quick Login:');
    console.log('• Super Admin: superadmin@example.com / password123');
    console.log('• Admin: admin@example.com / password123');
    
    console.log('\n🎉 Authentication seeding completed!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding authentication users:', error);
    
    if (error.code === 11000) {
      console.error('💡 Duplicate key error - users may already exist');
      console.error('💡 Run "npm run fresh" first to clear the database');
    }
    
    process.exit(1);
  }
};

const handleExit = () => {
  console.log('\n👋 Authentication seeding cancelled');
  process.exit(0);
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

console.log('Starting authentication users seeder...');
seedAuthUsers();