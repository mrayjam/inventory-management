import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { analyticsApi } from '../services/apiClient'

export default function Analytics() {
  const [revenueData, setRevenueData] = useState(null)
  const [topProducts, setTopProducts] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [inventoryValue, setInventoryValue] = useState(0)
  const [advancedMetrics, setAdvancedMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    const loadAnalyticsData = async () => {
      if (!token) return
      
      try {
        setLoading(true)
        const [revenueResponse, topProductsResponse, categoryDistribution, inventoryValueResponse, advancedMetricsResponse] = await Promise.all([
          analyticsApi.getRevenue(),
          analyticsApi.getTopSellingProducts(),
          analyticsApi.getCategoryDistribution(),
          analyticsApi.getInventoryValue(),
          analyticsApi.getAdvancedMetrics()
        ])
        
        setRevenueData(revenueResponse)
        setTopProducts(topProductsResponse)
        setCategoryData(categoryDistribution)
        setInventoryValue(inventoryValueResponse.totalInventoryValue)
        setAdvancedMetrics(advancedMetricsResponse)
      } catch (error) {
        console.error('Failed to load analytics data:', error)
        const message = error.response?.data?.message || error.message || 'Failed to load analytics data'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    loadAnalyticsData()
  }, [token])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl max-[1440px]:text-xl lg:text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-xs sm:text-sm max-[1440px]:text-xs lg:text-base text-slate-600 mt-1">Detailed insights into your inventory performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Summary</h3>
          {revenueData ? (
            <div className="grid grid-cols-2 gap-4">
              <div className={`rounded-lg p-4 ${
                (advancedMetrics?.profit || 0) >= 0 ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <p className={`text-sm font-medium ${
                  (advancedMetrics?.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {(advancedMetrics?.profit || 0) >= 0 ? 'Profit' : 'Loss'}
                </p>
                <p className={`text-2xl font-bold ${
                  (advancedMetrics?.profit || 0) >= 0 ? 'text-green-800' : 'text-red-800'
                }`}>
                  {(() => {
                    const profitValue = Math.abs(advancedMetrics?.profit || 0);
                    return profitValue >= 1000 
                      ? `$${(profitValue / 1000).toFixed(1)}K`
                      : `$${profitValue.toFixed(2)}`;
                  })()}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium">Total Sales</p>
                <p className="text-2xl font-bold text-blue-800">{revenueData.totalSales || 0}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-600 font-medium">Total Purchases</p>
                <p className="text-2xl font-bold text-purple-800">{revenueData.totalPurchases || 0}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-orange-600 font-medium">Sales This Month</p>
                <p className="text-2xl font-bold text-orange-800">{revenueData.salesThisMonth || 0}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No data available</div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Inventory Distribution</h3>
          <div className="flex flex-col xl:flex-row items-center">
            <div className="w-full xl:w-1/2">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} items`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full xl:w-1/2 lg:pl-4">
              <div className="space-y-3">
                {categoryData.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="font-medium text-slate-900 text-sm">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{category.value}</div>
                      <div className="text-xs text-slate-500">
                        {(() => {
                          const totalValue = categoryData.reduce((sum, cat) => sum + cat.value, 0);
                          return totalValue > 0 ? ((category.value / totalValue) * 100).toFixed(1) : '0.0';
                        })()}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
      >
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Performing Products</h3>
        
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 text-sm font-medium text-slate-600">Product</th>
                <th className="text-right py-3 text-sm font-medium text-slate-600 px-4">Units Sold</th>
                <th className="text-right py-3 text-sm font-medium text-slate-600">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topProducts.map((product, index) => (
                <motion.tr
                  key={product.productName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="hover:bg-slate-50"
                >
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className={`w-2 h-8 rounded-full mr-3 ${
                        index === 0 ? 'bg-yellow-400' :
                        index === 1 ? 'bg-slate-400' :
                        index === 2 ? 'bg-amber-600' :
                        'bg-slate-300'
                      }`} />
                      <span className="font-medium text-slate-900">{product.productName}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-900 px-4">{product.totalQuantity}</td>
                  <td className="py-3 text-right font-medium text-slate-900">
                    ${(product.totalRevenue || 0).toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {topProducts.map((product, index) => (
            <motion.div
              key={product.productName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-yellow-400' :
                    index === 1 ? 'bg-slate-400' :
                    index === 2 ? 'bg-amber-600' :
                    'bg-slate-300'
                  }`} />
                  <span className="font-medium text-slate-900 text-sm">{product.productName}</span>
                </div>
                <span className="text-xs text-slate-500">#{index + 1}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.totalQuantity} units
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Units Sold</div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ${(product.totalRevenue || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Revenue</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}