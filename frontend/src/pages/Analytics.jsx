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

const mockRevenueData = [
  { month: 'Jan', revenue: 45000, profit: 12000 },
  { month: 'Feb', revenue: 52000, profit: 15600 },
  { month: 'Mar', revenue: 48000, profit: 14400 },
  { month: 'Apr', revenue: 61000, profit: 18300 },
  { month: 'May', revenue: 55000, profit: 16500 },
  { month: 'Jun', revenue: 67000, profit: 20100 }
]

const mockCategoryData = [
  { name: 'Electronics', value: 450, color: '#3b82f6' },
  { name: 'Clothing', value: 320, color: '#10b981' },
  { name: 'Books', value: 280, color: '#f59e0b' },
  { name: 'Home & Garden', value: 197, color: '#ef4444' }
]

const mockTopProducts = [
  { name: 'Wireless Headphones', sales: 245, revenue: 24500 },
  { name: 'Cotton T-Shirt', sales: 189, revenue: 4725 },
  { name: 'Programming Guide', sales: 156, revenue: 7800 },
  { name: 'Garden Tools Set', sales: 87, revenue: 13913 },
  { name: 'Bluetooth Speaker', sales: 134, revenue: 10720 }
]

export default function Analytics() {
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
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue & Profit Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stackId="2"
                stroke="#10b981" 
                fill="#10b981"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Inventory Distribution</h3>
          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={mockCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {mockCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} items`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-1/2 lg:pl-4">
              <div className="space-y-3">
                {mockCategoryData.map((category, index) => (
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
                        {((category.value / mockCategoryData.reduce((sum, cat) => sum + cat.value, 0)) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6"
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
                {mockTopProducts.map((product, index) => (
                  <motion.tr
                    key={product.name}
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
                        <span className="font-medium text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-right text-slate-900 px-4">{product.sales}</td>
                    <td className="py-3 text-right font-medium text-slate-900">
                      ${product.revenue.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3">
            {mockTopProducts.map((product, index) => (
              <motion.div
                key={product.name}
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
                    <span className="font-medium text-slate-900 text-sm">{product.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">#{index + 1}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {product.sales} units
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Units Sold</div>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ${product.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Revenue</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Key Metrics</h3>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-slate-600">Inventory Turnover</span>
                <motion.span 
                  className="text-sm font-bold text-slate-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  8.5x
                </motion.span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: '85%' }}
                  transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-slate-600">Stock Accuracy</span>
                <motion.span 
                  className="text-sm font-bold text-slate-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                >
                  96.8%
                </motion.span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: '96.8%' }}
                  transition={{ delay: 1.0, duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-slate-600">Order Fill Rate</span>
                <motion.span 
                  className="text-sm font-bold text-slate-900"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1, type: "spring" }}
                >
                  94.2%
                </motion.span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: '94.2%' }}
                  transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="pt-6 border-t border-slate-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                <motion.div 
                  className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.6, type: "spring", damping: 15 }}
                >
                  $261.8k
                </motion.div>
                <div className="text-sm text-slate-600 font-medium">Total Inventory Value</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}