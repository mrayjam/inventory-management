import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CubeIcon,
  ExclamationTriangleIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import StatCard from "../components/StatCard";
import { SkeletonChart } from "../components/Skeleton";
import { useDashboard } from "../contexts/DashboardContext";
import { analyticsApi } from "../services/apiClient";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { stats, loading } = useDashboard();
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const loadChartData = async () => {
      if (!token) return;

      try {
        setChartsLoading(true);
        const [salesTrend, inventoryByCategory] = await Promise.all([
          analyticsApi.getSalesTrend(),
          analyticsApi.getInventoryByCategory(),
        ]);

        setSalesData(salesTrend);
        setInventoryData(inventoryByCategory);
      } catch (error) {
        console.error("Failed to load chart data:", error);
        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to load chart data";
        toast.error(message);
      } finally {
        setChartsLoading(false);
      }
    };

    loadChartData();
  }, [token]);

  const statsData = loading ? {
    totalProducts: null,
    lowStockItems: null,
    totalSuppliers: null,
    totalSalesAmount: null,
    totalPurchasesAmount: null,
    totalRevenue: null
  } : stats;




  return (
    <div className="relative w-full max-w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl max-[2178px]:text-xl lg:text-3xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm max-[2178px]:text-xs lg:text-base text-slate-600 mt-1">
          Welcome back! Here's what's happening with your inventory today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 min-[2178px]:grid-cols-6 gap-4 sm:gap-6 mb-6 lg:mb-8 px-3">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
        >
          <StatCard
            title="Total Products"
            value={statsData.totalProducts !== null ? statsData.totalProducts.toLocaleString() : "..."}
            rawValue={statsData.totalProducts}
            icon={CubeIcon}
            color="blue"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1.2, ease: "easeOut" }}
        >
          <StatCard
            title="Low Stock Items"
            value={statsData.lowStockItems !== null ? statsData.lowStockItems : "..."}
            rawValue={statsData.lowStockItems}
            icon={ExclamationTriangleIcon}
            color="red"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1.2, ease: "easeOut" }}
        >
          <StatCard
            title="Active Suppliers"
            value={statsData.totalSuppliers !== null ? statsData.totalSuppliers : "..."}
            rawValue={statsData.totalSuppliers}
            icon={BuildingStorefrontIcon}
            color="green"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
        >
          <StatCard
            title="Total Sales"
            value={statsData.totalSalesAmount !== null ? `$${statsData.totalSalesAmount || 0}` : "..."}
            rawValue={statsData.totalSalesAmount || 0}
            icon={ReceiptPercentIcon}
            color="purple"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1.2, ease: "easeOut" }}
        >
          <StatCard
            title="Total Purchases"
            value={
              statsData.totalPurchasesAmount !== null
                ? (statsData.totalPurchasesAmount > 0
                    ? `$${(statsData.totalPurchasesAmount / 1000).toFixed(1)}K`
                    : "$0")
                : "..."
            }
            rawValue={statsData.totalPurchasesAmount || 0}
            icon={ShoppingCartIcon}
            color="orange"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 1.2, ease: "easeOut" }}
        >
          <StatCard
            title="Total Revenue"
            value={statsData.totalRevenue !== null ? `$${statsData.totalRevenue}` : "..."}
            rawValue={statsData.totalRevenue || 0}
            icon={CurrencyDollarIcon}
            color="purple"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-3 sm:p-4 max-[2178px]:p-3 lg:p-6">
          <h3 className="text-sm sm:text-base max-[2178px]:text-sm lg:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">
            Sales Trend
          </h3>
          <div className="h-[200px] sm:h-[220px] max-[2178px]:h-[200px] lg:h-[280px] xl:h-[300px]">
            {chartsLoading ? (
              <SkeletonChart height="100%" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#64748b"
                    fontSize={window.innerWidth <= 2178 ? 9 : 10}
                    tickMargin={5}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={window.innerWidth <= 2178 ? 9 : 10}
                    tickMargin={5}
                    width={window.innerWidth <= 2178 ? 30 : 35}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: window.innerWidth <= 2178 ? "11px" : "12px",
                    }}
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Sales",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-3 sm:p-4 max-[2178px]:p-3 lg:p-6">
          <h3 className="text-sm sm:text-base max-[2178px]:text-sm lg:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">
            Inventory by Category
          </h3>
          <div className="h-[200px] sm:h-[220px] max-[2178px]:h-[200px] lg:h-[280px] xl:h-[320px]">
            {chartsLoading ? (
              <SkeletonChart height="100%" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={inventoryData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 45 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="category"
                    stroke="#64748b"
                    angle={-45}
                    textAnchor="end"
                    height={40}
                    fontSize={window.innerWidth <= 2178 ? 8 : 9}
                    interval={0}
                    tickMargin={5}
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={window.innerWidth <= 2178 ? 9 : 10}
                    tickMargin={5}
                    width={window.innerWidth <= 2178 ? 30 : 35}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: window.innerWidth <= 2178 ? "11px" : "12px",
                    }}
                    formatter={(value) => [value, "Items"]}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
