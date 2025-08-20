const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

const mockUsers = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: '2', 
    name: 'Super Admin',
    email: 'superadmin@example.com',
    role: 'super_admin'
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'john@example.com', 
    role: 'admin'
  },
  {
    id: '4',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'admin'
  }
]

let nextUserId = 5
let nextProductId = 5
let nextSupplierId = 5
let nextPurchaseId = 1
let nextSaleId = 1

const mockProducts = [
  { 
    id: 1, 
    name: 'Wireless Headphones', 
    category: 'Electronics', 
    price: 99.99, 
    stock: 45, 
    supplier: 'TechCorp',
    sku: 'WH-001',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life'
  },
  { 
    id: 2, 
    name: 'Cotton T-Shirt', 
    category: 'Clothing', 
    price: 24.99, 
    stock: 120, 
    supplier: 'FashionHub',
    sku: 'CT-002',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
    description: '100% organic cotton t-shirt, available in multiple colors and sizes'
  },
  { 
    id: 3, 
    name: 'Programming Guide', 
    category: 'Books', 
    price: 49.99, 
    stock: 8, 
    supplier: 'BookWorld',
    sku: 'PG-003',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300',
    description: 'Comprehensive guide to modern programming practices and design patterns'
  },
  { 
    id: 4, 
    name: 'Garden Tools Set', 
    category: 'Home & Garden', 
    price: 159.99, 
    stock: 25, 
    supplier: 'GreenThumb',
    sku: 'GT-004',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300',
    description: 'Professional 5-piece garden tools set with ergonomic handles and carrying case'
  }
]

const mockSuppliers = [
  { 
    id: 1, 
    name: 'TechCorp Solutions', 
    email: 'contact@techcorp.com', 
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94000',
    category: 'Electronics',
    status: 'Active'
  },
  { 
    id: 2, 
    name: 'FashionHub Inc', 
    email: 'orders@fashionhub.com', 
    phone: '+1 (555) 234-5678',
    address: '456 Fashion Ave, New York, NY 10001',
    category: 'Clothing',
    status: 'Active'
  },
  { 
    id: 3, 
    name: 'BookWorld Publishing', 
    email: 'sales@bookworld.com', 
    phone: '+1 (555) 345-6789',
    address: '789 Literature Blvd, Boston, MA 02101',
    category: 'Books',
    status: 'Inactive'
  },
  { 
    id: 4, 
    name: 'GreenThumb Gardens', 
    email: 'info@greenthumb.com', 
    phone: '+1 (555) 456-7890',
    address: '321 Garden Way, Portland, OR 97201',
    category: 'Home & Garden',
    status: 'Active'
  }
]

const mockPurchases = []

const mockSales = []

let totalRevenue = 0

const generateToken = (user) => {
  return `mock-jwt-token-${user.id}-${Date.now()}`
}

const verifyToken = (token) => {
  if (!token || !token.startsWith('mock-jwt-token-')) {
    return null
  }
  
  const parts = token.split('-')
  if (parts.length < 4) return null
  
  const userId = parts[3]
  return mockUsers.find(user => user.id === userId)
}

export const mockApi = {
  auth: {
    login: async (email, password) => {
      await delay(800)
      
      const user = mockUsers.find(u => u.email === email)
      
      if (!user) {
        throw new Error('Invalid email or password')
      }
      
      if (password.length < 6) {
        throw new Error('Invalid email or password')
      }
      
      const token = generateToken(user)
      
      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    },
    
    changePassword: async (token, currentPassword, newPassword) => {
      await delay(600)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      if (!currentPassword || currentPassword.length < 6) {
        throw new Error('Current password is incorrect')
      }
      
      if (!newPassword || newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters')
      }
      
      if (currentPassword === newPassword) {
        throw new Error('New password must be different from current password')
      }
      
      return {
        success: true,
        message: 'Password changed successfully'
      }
    }
  },
  
  users: {
    create: async (token, userData) => {
      await delay(700)
      
      const user = verifyToken(token)
      if (!user || user.role !== 'super_admin') {
        throw new Error('Forbidden - super_admin role required')
      }
      
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error('Name, email and password are required')
      }
      
      if (mockUsers.find(u => u.email === userData.email)) {
        throw new Error('Email already exists')
      }
      
      const newUser = {
        id: (nextUserId++).toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'admin'
      }
      
      mockUsers.push(newUser)
      
      return {
        success: true,
        user: newUser
      }
    },
    
    resetPassword: async (token, userId, newPassword) => {
      await delay(600)
      
      const user = verifyToken(token)
      if (!user || user.role !== 'super_admin') {
        throw new Error('Forbidden - super_admin role required')
      }
      
      const targetUser = mockUsers.find(u => u.id === userId)
      if (!targetUser) {
        throw new Error('User not found')
      }
      
      if (!newPassword || newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      
      return {
        success: true,
        message: 'Password reset successfully'
      }
    },
    
    getAdmins: async (token) => {
      await delay(400)
      
      const user = verifyToken(token)
      if (!user || user.role !== 'super_admin') {
        throw new Error('Forbidden - super_admin role required')
      }
      
      return mockUsers.filter(u => u.role === 'admin')
    }
  },
  
  products: {
    getAll: async (token) => {
      await delay(500)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      return [...mockProducts]
    },
    
    getById: async (token, id) => {
      await delay(300)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      const product = mockProducts.find(p => p.id === parseInt(id))
      if (!product) {
        throw new Error('Product not found')
      }
      
      return product
    },
    
    create: async (token, productData) => {
      await delay(800)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      if (!productData.name || !productData.category || !productData.sku) {
        throw new Error('All required fields must be provided')
      }
      
      if (mockProducts.find(p => p.sku === productData.sku)) {
        throw new Error('SKU already exists')
      }
      
      const newProduct = {
        id: nextProductId++,
        ...productData,
        stock: 0,
        imageUrl: productData.imageUrl || 'https://via.placeholder.com/300',
        description: productData.description || 'No description provided'
      }
      
      mockProducts.push(newProduct)
      
      return {
        success: true,
        data: newProduct
      }
    },
    
    update: async (token, id, productData) => {
      await delay(700)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      const productIndex = mockProducts.findIndex(p => p.id === parseInt(id))
      if (productIndex === -1) {
        throw new Error('Product not found')
      }
      
      if (productData.sku && mockProducts.find(p => p.sku === productData.sku && p.id !== parseInt(id))) {
        throw new Error('SKU already exists')
      }
      
      const updatedProduct = {
        ...mockProducts[productIndex],
        ...productData,
        stock: productData.stock ? parseInt(productData.stock) : mockProducts[productIndex].stock
      }
      
      mockProducts[productIndex] = updatedProduct
      
      return {
        success: true,
        data: updatedProduct
      }
    },
    
    delete: async (token, id) => {
      await delay(500)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      const productIndex = mockProducts.findIndex(p => p.id === parseInt(id))
      if (productIndex === -1) {
        throw new Error('Product not found')
      }
      
      mockProducts.splice(productIndex, 1)
      
      return {
        success: true,
        message: 'Product deleted successfully'
      }
    }
  },
  
  uploads: {
    uploadFile: async (token, file) => {
      await delay(1200)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      if (!file) {
        throw new Error('No file provided')
      }
      
      const mockImageUrls = [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300',
        'https://via.placeholder.com/300'
      ]
      
      const randomUrl = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)]
      
      return {
        url: randomUrl
      }
    }
  },

  suppliers: {
    getAll: async (token) => {
      await delay(400)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      return [...mockSuppliers]
    },

    getById: async (token, id) => {
      await delay(300)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      const supplier = mockSuppliers.find(s => s.id === parseInt(id))
      if (!supplier) {
        throw new Error('Supplier not found')
      }
      
      return supplier
    },

    create: async (token, supplierData) => {
      await delay(700)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      if (!supplierData.name || !supplierData.email || !supplierData.category) {
        throw new Error('Name, email and category are required')
      }
      
      if (mockSuppliers.find(s => s.email === supplierData.email)) {
        throw new Error('Email already exists')
      }
      
      const newSupplier = {
        id: nextSupplierId++,
        ...supplierData,
        status: supplierData.status || 'Active'
      }
      
      mockSuppliers.push(newSupplier)
      
      return {
        success: true,
        data: newSupplier
      }
    },

    update: async (token, id, supplierData) => {
      await delay(600)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      const supplierIndex = mockSuppliers.findIndex(s => s.id === parseInt(id))
      if (supplierIndex === -1) {
        throw new Error('Supplier not found')
      }
      
      if (supplierData.email && mockSuppliers.find(s => s.email === supplierData.email && s.id !== parseInt(id))) {
        throw new Error('Email already exists')
      }
      
      const updatedSupplier = {
        ...mockSuppliers[supplierIndex],
        ...supplierData
      }
      
      mockSuppliers[supplierIndex] = updatedSupplier
      
      return {
        success: true,
        data: updatedSupplier
      }
    },

    delete: async (token, id) => {
      await delay(500)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      const supplierIndex = mockSuppliers.findIndex(s => s.id === parseInt(id))
      if (supplierIndex === -1) {
        throw new Error('Supplier not found')
      }
      
      mockSuppliers.splice(supplierIndex, 1)
      
      return {
        success: true,
        message: 'Supplier deleted successfully'
      }
    }
  },

  purchases: {
    getAll: async (token) => {
      await delay(400)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      return [...mockPurchases]
    },

    create: async (token, purchaseData) => {
      await delay(1000)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      if (!purchaseData.productId || !purchaseData.quantity || !purchaseData.supplierId || !purchaseData.unitPrice) {
        throw new Error('Product, quantity, supplier and unit price are required')
      }
      
      const product = mockProducts.find(p => p.id === parseInt(purchaseData.productId))
      if (!product) {
        throw new Error('Product not found')
      }
      
      const supplier = mockSuppliers.find(s => s.id === parseInt(purchaseData.supplierId))
      if (!supplier) {
        throw new Error('Supplier not found')
      }
      
      if (supplier.status !== 'Active') {
        throw new Error('Cannot purchase from inactive supplier')
      }
      
      const quantity = parseInt(purchaseData.quantity)
      const unitPrice = parseFloat(purchaseData.unitPrice)
      
      if (unitPrice <= 0) {
        throw new Error('Unit price must be greater than 0')
      }
      
      const totalAmount = (quantity * unitPrice).toFixed(2)
      
      const purchase = {
        id: nextPurchaseId++,
        productId: product.id,
        productName: purchaseData.productName || product.name,
        productSku: purchaseData.productSku || product.sku,
        supplierId: supplier.id,
        supplierName: purchaseData.supplierName || supplier.name,
        quantity,
        unitPrice,
        totalAmount: parseFloat(totalAmount),
        purchaseDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        createdBy: user.name
      }
      
      mockPurchases.push(purchase)
      
      const productIndex = mockProducts.findIndex(p => p.id === product.id)
      mockProducts[productIndex].stock += quantity
      
      const invoice = {
        id: `INV-${Date.now()}`,
        purchaseId: purchase.id,
        date: new Date().toLocaleDateString(),
        totalAmount: totalAmount,
        status: 'Paid',
        generatedBy: user.name,
        generatedAt: new Date().toISOString()
      }
      
      return {
        success: true,
        purchase,
        invoice,
        message: 'Purchase registered successfully'
      }
    },

    getById: async (token, id) => {
      await delay(300)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      const purchase = mockPurchases.find(p => p.id === parseInt(id))
      if (!purchase) {
        throw new Error('Purchase not found')
      }
      
      return purchase
    }
  },

  sales: {
    getAll: async (token) => {
      await delay(400)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      return [...mockSales]
    },

    getById: async (token, id) => {
      await delay(300)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      const sale = mockSales.find(s => s.id === parseInt(id))
      if (!sale) {
        throw new Error('Sale not found')
      }
      
      return sale
    },

    create: async (token, saleData) => {
      await delay(800)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      if (!saleData.productId || !saleData.quantity || !saleData.salePrice) {
        throw new Error('Product, quantity, and sale price are required')
      }
      
      const product = mockProducts.find(p => p.id === parseInt(saleData.productId))
      if (!product) {
        throw new Error('Product not found')
      }
      
      const quantity = parseInt(saleData.quantity)
      const salePrice = parseFloat(saleData.salePrice)
      
      if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0')
      }
      
      if (salePrice <= 0) {
        throw new Error('Sale price must be greater than 0')
      }
      
      if (product.stock < quantity) {
        throw new Error(`Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`)
      }
      
      const totalAmount = (quantity * salePrice).toFixed(2)
      
      const sale = {
        id: nextSaleId++,
        productId: product.id,
        productName: saleData.productName || product.name,
        productSku: saleData.productSku || product.sku,
        quantity,
        salePrice,
        totalAmount: parseFloat(totalAmount),
        customer: saleData.customer || '',
        saleDate: saleData.saleDate || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        createdBy: user.name
      }
      
      mockSales.push(sale)
      
      const productIndex = mockProducts.findIndex(p => p.id === product.id)
      mockProducts[productIndex].stock -= quantity
      
      totalRevenue += parseFloat(totalAmount)
      
      return {
        success: true,
        sale,
        message: 'Sale recorded successfully'
      }
    },

    update: async (token, id, saleData) => {
      await delay(700)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      const saleIndex = mockSales.findIndex(s => s.id === parseInt(id))
      if (saleIndex === -1) {
        throw new Error('Sale not found')
      }
      
      const oldSale = mockSales[saleIndex]
      const oldProduct = mockProducts.find(p => p.id === oldSale.productId)
      
      if (oldProduct) {
        oldProduct.stock += oldSale.quantity
        totalRevenue -= oldSale.totalAmount
      }
      
      if (saleData.productId && saleData.productId !== oldSale.productId) {
        const newProduct = mockProducts.find(p => p.id === parseInt(saleData.productId))
        if (!newProduct) {
          throw new Error('Product not found')
        }
        
        const quantity = parseInt(saleData.quantity || oldSale.quantity)
        if (newProduct.stock < quantity) {
          throw new Error(`Insufficient stock. Available: ${newProduct.stock}, Requested: ${quantity}`)
        }
      }
      
      const updatedSale = {
        ...oldSale,
        ...saleData,
        quantity: parseInt(saleData.quantity || oldSale.quantity),
        salePrice: parseFloat(saleData.salePrice || oldSale.salePrice),
        totalAmount: parseFloat((parseInt(saleData.quantity || oldSale.quantity) * parseFloat(saleData.salePrice || oldSale.salePrice)).toFixed(2)),
        updatedAt: new Date().toISOString(),
        updatedBy: user.name
      }
      
      const product = mockProducts.find(p => p.id === updatedSale.productId)
      if (product) {
        product.stock -= updatedSale.quantity
        totalRevenue += updatedSale.totalAmount
      }
      
      mockSales[saleIndex] = updatedSale
      
      return {
        success: true,
        sale: updatedSale
      }
    },

    delete: async (token, id) => {
      await delay(500)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      const saleIndex = mockSales.findIndex(s => s.id === parseInt(id))
      if (saleIndex === -1) {
        throw new Error('Sale not found')
      }
      
      const sale = mockSales[saleIndex]
      const product = mockProducts.find(p => p.id === sale.productId)
      
      if (product) {
        product.stock += sale.quantity
      }
      
      totalRevenue -= sale.totalAmount
      
      mockSales.splice(saleIndex, 1)
      
      return {
        success: true,
        message: 'Sale deleted successfully'
      }
    }
  },

  analytics: {
    getRevenue: async (token) => {
      await delay(300)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      return {
        totalRevenue,
        totalSales: mockSales.length,
        salesThisMonth: mockSales.filter(sale => {
          const saleDate = new Date(sale.saleDate)
          const now = new Date()
          return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
        }).length
      }
    },

    getTopSellingProducts: async (token) => {
      await delay(400)
      
      const user = verifyToken(token)
      if (!user) {
        throw new Error('Unauthorized')
      }
      
      const productSales = {}
      
      mockSales.forEach(sale => {
        if (!productSales[sale.productId]) {
          productSales[sale.productId] = {
            productId: sale.productId,
            productName: sale.productName,
            totalQuantity: 0,
            totalRevenue: 0
          }
        }
        
        productSales[sale.productId].totalQuantity += sale.quantity
        productSales[sale.productId].totalRevenue += sale.totalAmount
      })
      
      return Object.values(productSales)
        .sort((a, b) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5)
    }
  }
}