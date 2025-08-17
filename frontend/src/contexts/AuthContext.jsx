import { createContext, useContext, useState, useEffect } from 'react'

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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }

      const data = await response.json()
      
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
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Password change failed')
      }

      return { success: true, message: data.message }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const createAdmin = async (name, email, password) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password, role: 'admin' }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Admin creation failed')
      }

      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const resetAdminPassword = async (userId, newPassword) => {
    try {
      const response = await fetch(`/api/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed')
      }

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