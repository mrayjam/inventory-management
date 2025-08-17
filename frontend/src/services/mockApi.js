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
      
      if (!productData.name || !productData.category || !productData.price || !productData.stock || !productData.supplier || !productData.sku) {
        throw new Error('All required fields must be provided')
      }
      
      if (mockProducts.find(p => p.sku === productData.sku)) {
        throw new Error('SKU already exists')
      }
      
      const newProduct = {
        id: nextProductId++,
        ...productData,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock),
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
        price: productData.price ? parseFloat(productData.price) : mockProducts[productIndex].price,
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
  }
}