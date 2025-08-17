import { createContext, useContext, useState, useEffect } from 'react'
import { mockApi } from '../services/mockApi'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('authUser')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const data = await mockApi.auth.login(email, password)
      
      setToken(data.token)
      setUser(data.user)
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('authUser', JSON.stringify(data.user))
      
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const data = await mockApi.auth.changePassword(token, currentPassword, newPassword)
      return { success: true, message: data.message }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const createAdmin = async (name, email, password) => {
    try {
      const data = await mockApi.users.create(token, { name, email, password, role: 'admin' })
      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const resetAdminPassword = async (userId, newPassword) => {
    try {
      const data = await mockApi.users.resetPassword(token, userId, newPassword)
      return { success: true, message: data.message }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const isAuthenticated = () => !!token && !!user
  const isSuperAdmin = () => user?.role === 'super_admin'
  const isAdmin = () => user?.role === 'admin' || isSuperAdmin()

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    changePassword,
    createAdmin,
    resetAdminPassword,
    isAuthenticated,
    isSuperAdmin,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}