import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { productsApi, suppliersApi, analyticsApi } from '../services/apiClient'

const DashboardContext = createContext()

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    totalSuppliers: 0,
    totalSales: 0,
    totalSalesAmount: 0,
    totalRevenue: 0,
    totalPurchases: 0,
    totalPurchasesAmount: 0
  })
  const [loading, setLoading] = useState(true)
  
  const { token } = useAuth()

  const refreshStats = useCallback(async () => {
    if (!token) return
    
    try {
      const [products, suppliers, revenueData] = await Promise.all([
        productsApi.getAll(),
        suppliersApi.getAll(),
        analyticsApi.getRevenue()
      ])
      
      const lowStockProducts = products.filter(p => p.stock < 20)
      const activeSuppliers = suppliers.filter(s => s.status === 'Active')
      
      setStats({
        totalProducts: products.length,
        lowStockItems: lowStockProducts.length,
        totalSuppliers: activeSuppliers.length,
        totalSales: revenueData?.totalSales ?? 0,
        totalSalesAmount: revenueData?.totalSalesAmount ?? 0,
        totalRevenue: revenueData?.totalRevenue ?? 0,
        totalPurchases: revenueData?.totalPurchases ?? 0,
        totalPurchasesAmount: revenueData?.totalPurchasesAmount ?? 0
      })
    } catch (error) {
      console.error('Failed to refresh dashboard stats:', error)
      if (error.response?.status === 401) {
        return
      }
      setStats(prev => ({
        ...prev,
        totalSales: 0,
        totalSalesAmount: 0,
        totalRevenue: 0,
        totalPurchases: 0,
        totalPurchasesAmount: 0
      }))
    }
  }, [token])

  const incrementPurchases = () => {
    setStats(prev => ({
      ...prev,
      totalPurchases: prev.totalPurchases + 1
    }))
  }

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      await refreshStats()
      setLoading(false)
    }

    if (token) {
      loadInitialData()
    }
  }, [token, refreshStats])

  const value = {
    stats,
    loading,
    refreshStats,
    incrementPurchases
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}