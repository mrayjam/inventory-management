import dotenv from 'dotenv';
import mongoose from 'mongoose';
import readline from 'readline';
import connectDatabase from '../config/database.js';

dotenv.config();

let rl = null;

const createReadlineInterface = () => {
  if (!rl || rl.closed) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }
  return rl;
};

const askQuestion = (question) => {
  return new Promise((resolve) => {
    const readlineInterface = createReadlineInterface();
    readlineInterface.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const freshDatabase = async () => {
  try {
    console.log('🔄 MongoDB Fresh Migration Tool');
    console.log('================================');
    console.log(`📍 Database: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_management'}`);
    console.log();
    
    await connectDatabase();
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('ℹ️  No collections found in the database.');
      console.log('✅ Database is already fresh!');
      process.exit(0);
    }
    
    console.log(`📊 Found ${collections.length} collection(s):`);
    collections.forEach((collection, index) => {
      console.log(`   ${index + 1}. ${collection.name}`);
    });
    console.log();
    
    console.log('⚠️  WARNING: This will permanently delete ALL data in the database!');
    console.log('⚠️  This action cannot be undone!');
    console.log();
    
    const confirmation = await askQuestion('Are you sure you want to drop all collections? (yes/no): ');
    
    if (confirmation.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled.');
      process.exit(0);
    }
    
    console.log();
    console.log('🗑️  Dropping all collections...');
    
    let droppedCount = 0;
    for (const collection of collections) {
      try {
        await db.collection(collection.name).drop();
        console.log(`   ✅ Dropped: ${collection.name}`);
        droppedCount++;
      } catch (error) {
        if (error.message.includes('ns not found')) {
          console.log(`   ⚠️  Collection already dropped: ${collection.name}`);
        } else {
          console.log(`   ❌ Failed to drop ${collection.name}: ${error.message}`);
        }
      }
    }
    
    console.log();
    console.log(`✅ Successfully dropped ${droppedCount} collection(s)`);
    console.log('🎉 Database is now fresh!');
    console.log();
    console.log('💡 To populate with seed data, run: npm run seed');
    
  } catch (error) {
    console.error('❌ Error during fresh migration:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  } finally {
    if (rl && !rl.closed) {
      rl.close();
    }
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('📴 Disconnected from MongoDB');
    }
  }
};

const handleExit = () => {
  console.log('\n👋 Goodbye!');
  if (rl && !rl.closed) {
    rl.close();
  }
  if (mongoose.connection.readyState === 1) {
    mongoose.connection.close();
  }
  process.exit(0);
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

freshDatabase();