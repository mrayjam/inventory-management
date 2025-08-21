import Sale from '../models/Sale.js';
import Purchase from '../models/Purchase.js';

export const getRevenue = async (req, res) => {
  try {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Get all sales for total revenue calculation
    const allSales = await Sale.find();
    const totalRevenue = allSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

    // Get total counts
    const totalSales = allSales.length;
    const allPurchases = await Purchase.find();
    const totalPurchases = allPurchases.length;

    // Calculate purchases this month vs last month for percentage change
    const purchasesThisMonth = allPurchases.filter(purchase => {
      const purchaseDate = new Date(purchase.purchaseDate);
      return purchaseDate.getMonth() === currentMonth && purchaseDate.getFullYear() === currentYear;
    }).length;

    const purchasesLastMonth = allPurchases.filter(purchase => {
      const purchaseDate = new Date(purchase.purchaseDate);
      return purchaseDate.getMonth() === lastMonth && purchaseDate.getFullYear() === lastMonthYear;
    }).length;

    const purchasePercentageChange = purchasesLastMonth === 0 
      ? (purchasesThisMonth > 0 ? 100 : 0)
      : Math.round(((purchasesThisMonth - purchasesLastMonth) / purchasesLastMonth) * 100);

    // Calculate sales this month
    const salesThisMonth = allSales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    }).length;

    res.json({
      totalRevenue,
      totalSales,
      totalPurchases,
      purchasePercentageChange,
      salesThisMonth
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const sales = await Sale.find();
    const productSales = {};

    // Aggregate sales by product
    sales.forEach(sale => {
      const productId = sale.productId.toString();
      if (!productSales[productId]) {
        productSales[productId] = {
          productId,
          productName: sale.productName,
          totalQuantity: 0,
          totalRevenue: 0
        };
      }
      
      productSales[productId].totalQuantity += sale.quantity;
      productSales[productId].totalRevenue += sale.totalAmount;
    });

    // Sort by total quantity sold and return top 5
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};