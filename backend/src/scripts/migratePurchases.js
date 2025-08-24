import mongoose from 'mongoose';
import Purchase from '../models/Purchase.js';
import connectDatabase from '../config/database.js';

// Script to migrate existing purchases and ensure totalAmount is calculated
const migratePurchases = async () => {
  try {
    await connectDatabase();
    console.log('Connected to database');

    // Find all purchases without totalAmount or with totalAmount = 0
    const purchases = await Purchase.find({
      $or: [
        { totalAmount: { $exists: false } },
        { totalAmount: 0 },
        { totalAmount: null }
      ]
    });

    console.log(`Found ${purchases.length} purchases that need totalAmount calculation`);

    let updatedCount = 0;
    for (const purchase of purchases) {
      const totalAmount = purchase.quantity * purchase.unitPrice;
      await Purchase.findByIdAndUpdate(purchase._id, { totalAmount });
      updatedCount++;
      console.log(`Updated purchase ${purchase._id}: ${purchase.quantity} × $${purchase.unitPrice} = $${totalAmount}`);
    }

    console.log(`Successfully updated ${updatedCount} purchases`);
    
    // Verify the update
    const remainingPurchases = await Purchase.find({
      $or: [
        { totalAmount: { $exists: false } },
        { totalAmount: 0 },
        { totalAmount: null }
      ]
    });

    if (remainingPurchases.length === 0) {
      console.log('Migration completed successfully - all purchases now have totalAmount');
    } else {
      console.log(`Warning: ${remainingPurchases.length} purchases still missing totalAmount`);
    }

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migratePurchases();
}

export default migratePurchases;