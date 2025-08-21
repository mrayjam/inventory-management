import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  },
  
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.post('/auth/change-password', { 
      currentPassword, 
      newPassword 
    })
    return response.data
  }
}

export const usersApi = {
  create: async (userData) => {
    const response = await apiClient.post('/users', userData)
    return response.data
  },
  
  getAdmins: async () => {
    const response = await apiClient.get('/users/admins')
    return response.data
  },
  
  resetPassword: async (userId, newPassword) => {
    const response = await apiClient.post(`/users/${userId}/reset-password`, { newPassword })
    return response.data
  }
}

export const productsApi = {
  getAll: async () => {
    const response = await apiClient.get('/products')
    return response.data
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  },
  
  create: async (productData) => {
    const response = await apiClient.post('/products', productData)
    return response.data
  },
  
  update: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}`, productData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/products/${id}`)
    return response.data
  }
}

export const suppliersApi = {
  getAll: async () => {
    const response = await apiClient.get('/suppliers')
    return response.data
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/suppliers/${id}`)
    return response.data
  },
  
  create: async (supplierData) => {
    const response = await apiClient.post('/suppliers', supplierData)
    return response.data
  },
  
  update: async (id, supplierData) => {
    const response = await apiClient.put(`/suppliers/${id}`, supplierData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/suppliers/${id}`)
    return response.data
  }
}

export const purchasesApi = {
  getAll: async () => {
    const response = await apiClient.get('/purchases')
    return response.data
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/purchases/${id}`)
    return response.data
  },
  
  create: async (purchaseData) => {
    const response = await apiClient.post('/purchases', purchaseData)
    return response.data
  },
  
  update: async (id, purchaseData) => {
    const response = await apiClient.put(`/purchases/${id}`, purchaseData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/purchases/${id}`)
    return response.data
  }
}

export const salesApi = {
  getAll: async () => {
    const response = await apiClient.get('/sales')
    return response.data
  },
  
  getById: async (id) => {
    const response = await apiClient.get(`/sales/${id}`)
    return response.data
  },
  
  create: async (saleData) => {
    const response = await apiClient.post('/sales', saleData)
    return response.data
  },
  
  update: async (id, saleData) => {
    const response = await apiClient.put(`/sales/${id}`, saleData)
    return response.data
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/sales/${id}`)
    return response.data
  }
}

export const analyticsApi = {
  getRevenue: async () => {
    const response = await apiClient.get('/analytics/revenue')
    return response.data
  },
  
  getTopSellingProducts: async () => {
    const response = await apiClient.get('/analytics/top-selling')
    return response.data
  }
}

export const uploadsApi = {
  uploadFile: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await apiClient.post('/uploads/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }
}

export default apiClient