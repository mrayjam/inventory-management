import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CubeIcon, 
  ExclamationTriangleIcon, 
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  ReceiptPercentIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import StatCard from '../components/StatCard'
import { useDashboard } from '../contexts/DashboardContext'
import { analyticsApi } from '../services/apiClient'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'


export default function Dashboard() {
  const { stats, loading } = useDashboard()
  const [salesData, setSalesData] = useState([])
  const [inventoryData, setInventoryData] = useState([])
  const [chartsLoading, setChartsLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const loadChartData = async () => {
      if (!token) return
      
      try {
        setChartsLoading(true)
        const [salesTrend, inventoryByCategory] = await Promise.all([
          analyticsApi.getSalesTrend(),
          analyticsApi.getInventoryByCategory()
        ])
        
        setSalesData(salesTrend)
        setInventoryData(inventoryByCategory)
      } catch (error) {
        console.error('Failed to load chart data:', error)
        const message = error.response?.data?.message || error.message || 'Failed to load chart data'
        toast.error(message)
      } finally {
        setChartsLoading(false)
      }
    }

    loadChartData()
  }, [token])


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-full overflow-x-hidden">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl max-[1440px]:text-xl lg:text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-xs sm:text-sm max-[1440px]:text-xs lg:text-base text-slate-600 mt-1">Welcome back! Here's what's happening with your inventory today.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4 sm:gap-6 mb-6 lg:mb-8 px-3"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <StatCard
              title="Total Products"
              value={stats.totalProducts.toLocaleString()}
              rawValue={stats.totalProducts}
              icon={CubeIcon}
              color="blue"
              trend={12}
            />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <StatCard
              title="Low Stock Items"
              value={stats.lowStockItems}
              rawValue={stats.lowStockItems}
              icon={ExclamationTriangleIcon}
              color="red"
              trend={-8}
            />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <StatCard
              title="Active Suppliers"
              value={stats.totalSuppliers}
              rawValue={stats.totalSuppliers}
              icon={BuildingStorefrontIcon}
              color="green"
              trend={5}
            />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <StatCard
              title="Total Sales"
              value={stats.totalSales}
              rawValue={stats.totalSales}
              icon={ReceiptPercentIcon}
              color="purple"
              trend={25}
            />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <StatCard
              title="Total Purchases"
              value={stats.totalPurchases || 0}
              rawValue={stats.totalPurchases || 0}
              icon={ShoppingCartIcon}
              color="orange"
              trend={stats.purchasePercentageChange || 0}
            />
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <StatCard
              title="Total Revenue"
              value={stats.totalRevenue > 0 ? `$${(stats.totalRevenue / 1000).toFixed(1)}K` : '$0'}
              rawValue={stats.totalRevenue || 0}
              icon={CurrencyDollarIcon}
              color="purple"
              trend={18}
            />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-3 sm:p-4 max-[1440px]:p-3 lg:p-6"
          >
            <h3 className="text-sm sm:text-base max-[1440px]:text-sm lg:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Sales Trend</h3>
            <div className="h-[200px] sm:h-[220px] max-[1440px]:h-[200px] lg:h-[280px] xl:h-[300px]">
              {chartsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={window.innerWidth <= 1440 ? 9 : 10}
                  tickMargin={5}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={window.innerWidth <= 1440 ? 9 : 10}
                  tickMargin={5}
                  width={window.innerWidth <= 1440 ? 30 : 35}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: window.innerWidth <= 1440 ? '11px' : '12px'
                  }}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
              </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-3 sm:p-4 max-[1440px]:p-3 lg:p-6"
          >
            <h3 className="text-sm sm:text-base max-[1440px]:text-sm lg:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Inventory by Category</h3>
            <div className="h-[200px] sm:h-[220px] max-[1440px]:h-[200px] lg:h-[280px] xl:h-[320px]">
              {chartsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
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
                  fontSize={window.innerWidth <= 1440 ? 8 : 9}
                  interval={0}
                  tickMargin={5}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={window.innerWidth <= 1440 ? 9 : 10}
                  tickMargin={5}
                  width={window.innerWidth <= 1440 ? 30 : 35}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: window.innerWidth <= 1440 ? '11px' : '12px'
                  }}
                  formatter={(value) => [value, 'Items']}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        </div>
    </div>
  )
}