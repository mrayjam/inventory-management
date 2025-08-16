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
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-1">Detailed insights into your inventory performance</p>
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
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 text-sm font-medium text-slate-600">Product</th>
                  <th className="text-right py-3 text-sm font-medium text-slate-600">Units Sold</th>
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
                    <td className="py-3 text-right text-slate-900">{product.sales}</td>
                    <td className="py-3 text-right font-medium text-slate-900">
                      ${product.revenue.toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Key Metrics</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">Inventory Turnover</span>
                <span className="text-sm font-bold text-slate-900">8.5x</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">Stock Accuracy</span>
                <span className="text-sm font-bold text-slate-900">96.8%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '96.8%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-600">Order Fill Rate</span>
                <span className="text-sm font-bold text-slate-900">94.2%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '94.2%' }} />
              </div>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">$261.8k</div>
                <div className="text-sm text-slate-600">Total Inventory Value</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}