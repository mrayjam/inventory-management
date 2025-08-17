import { motion } from 'framer-motion'
import { 
  CubeIcon, 
  ExclamationTriangleIcon, 
  BuildingStorefrontIcon,
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import StatCard from '../components/StatCard'

const mockStats = {
  totalProducts: 1247,
  lowStockItems: 23,
  totalSuppliers: 45,
  monthlyRevenue: 125000
}

const mockSalesData = [
  { month: 'Jan', sales: 45000 },
  { month: 'Feb', sales: 52000 },
  { month: 'Mar', sales: 48000 },
  { month: 'Apr', sales: 61000 },
  { month: 'May', sales: 55000 },
  { month: 'Jun', sales: 67000 }
]

const mockInventoryData = [
  { category: 'Electronics', count: 450 },
  { category: 'Clothing', count: 320 },
  { category: 'Books', count: 280 },
  { category: 'Home & Garden', count: 197 }
]


export default function Dashboard() {
  return (
    <div className="relative w-full max-w-full overflow-x-hidden">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">Welcome back! Here's what's happening with your inventory today.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 lg:mb-8">
          <StatCard
            title="Total Products"
            value={mockStats.totalProducts.toLocaleString()}
            rawValue={mockStats.totalProducts}
            icon={CubeIcon}
            color="blue"
            trend={12}
          />
          <StatCard
            title="Low Stock Items"
            value={mockStats.lowStockItems}
            rawValue={mockStats.lowStockItems}
            icon={ExclamationTriangleIcon}
            color="red"
            trend={-8}
          />
          <StatCard
            title="Active Suppliers"
            value={mockStats.totalSuppliers}
            rawValue={mockStats.totalSuppliers}
            icon={BuildingStorefrontIcon}
            color="green"
            trend={5}
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${(mockStats.monthlyRevenue / 1000).toFixed(0)}K`}
            rawValue={mockStats.monthlyRevenue}
            icon={CurrencyDollarIcon}
            color="purple"
            trend={18}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-3 sm:p-4 lg:p-6"
          >
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Sales Trend</h3>
            <div className="h-[250px] sm:h-[280px] lg:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockSalesData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickMargin={5}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickMargin={5}
                  width={35}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
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
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-3 sm:p-4 lg:p-6"
          >
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Inventory by Category</h3>
            <div className="h-[250px] sm:h-[280px] lg:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={mockInventoryData} 
                  margin={{ top: 10, right: 10, left: 0, bottom: 45 }}
                >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="category" 
                  stroke="#64748b" 
                  angle={-45}
                  textAnchor="end"
                  height={40}
                  fontSize={9}
                  interval={0}
                  tickMargin={5}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickMargin={5}
                  width={35}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [value, 'Items']}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
    </div>
  )
}