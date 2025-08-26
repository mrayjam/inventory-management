import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { FloatingLabelInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  XMarkIcon,
  ShoppingCartIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useDashboard } from '../contexts/DashboardContext'
import { purchasesApi, productsApi, suppliersApi } from '../services/apiClient'
import { SkeletonPurchasesTable, SkeletonCarousel } from '../components/Skeleton'

// Utility function to format currency
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00'
  }
  
  const numAmount = parseFloat(amount)
  
  // For amounts >= 1000, use K notation
  if (numAmount >= 1000) {
    return `$${(numAmount / 1000).toFixed(1)}K`
  }
  
  return `$${numAmount.toFixed(2)}`
}

// Purchase Detail Modal Component
const PurchaseDetailModal = ({ isOpen, onClose, purchase, onEditPurchase }) => {
  if (!isOpen || !purchase) return null

  const handleEditClick = () => {
    onEditPurchase(purchase)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-sm sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ShoppingCartIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Purchase Details</h2>
                <p className="text-sm text-gray-500">Purchase #{purchase.id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Product</p>
                <p className="text-lg font-semibold text-gray-900">{purchase.productName}</p>
                <p className="text-sm text-gray-600">SKU: {purchase.productSku}</p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Supplier</p>
                <p className="text-lg text-gray-900">{purchase.supplierName}</p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Quantity</p>
                <p className="text-lg font-semibold text-blue-600">{purchase.quantity} units</p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Unit Price</p>
                <p className="text-lg font-semibold text-green-600">${purchase.unitPrice}</p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Purchase Date</p>
                <p className="text-lg text-gray-900">{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm font-medium text-green-700 mb-1">Total Amount</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(purchase.totalAmount)}</p>
              </div>
            </div>

            {purchase.createdBy && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-gray-500 mb-2">Purchase Information</p>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">Created by: {purchase.createdBy}</p>
                  <p className="text-sm text-gray-600">Created at: {new Date(purchase.createdAt).toLocaleString()}</p>
                  {purchase.updatedBy && (
                    <>
                      <p className="text-sm text-gray-600">Updated by: {purchase.updatedBy}</p>
                      <p className="text-sm text-gray-600">Updated at: {new Date(purchase.updatedAt).toLocaleString()}</p>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleEditClick}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <PencilIcon className="w-4 h-4" />
                Edit Purchase
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Purchase Form Modal Component
const PurchaseModal = ({ 
  isOpen, 
  onClose, 
  purchase, 
  onSave, 
  products, 
  suppliers,
  isLoading 
}) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    supplierId: '',
    unitPrice: '',
    purchaseDate: ''
  })
  
  const isEditMode = !!purchase

  useEffect(() => {
    if (purchase) {
      setFormData({
        productId: purchase.productId,
        quantity: purchase.quantity.toString(),
        supplierId: purchase.supplierId,
        unitPrice: purchase.unitPrice.toString(),
        purchaseDate: purchase.purchaseDate || ''
      })
    } else {
      const today = new Date().toISOString().split('T')[0]
      setFormData({
        productId: '',
        quantity: '',
        supplierId: '',
        unitPrice: '',
        purchaseDate: today
      })
    }
  }, [purchase])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.productId) {
      toast.error('Please select a product')
      return false
    }
    
    const selectedProduct = products.find(p => p.id === formData.productId)
    if (!selectedProduct) {
      toast.error('Selected product does not exist')
      return false
    }

    if (!formData.quantity) {
      toast.error('Please enter quantity')
      return false
    }
    
    const quantity = parseInt(formData.quantity)
    if (isNaN(quantity) || quantity < 1) {
      toast.error('Quantity must be a number greater than or equal to 1')
      return false
    }

    if (!formData.supplierId) {
      toast.error('Please select a supplier')
      return false
    }
    
    const selectedSupplier = suppliers.find(s => s.id === formData.supplierId)
    if (!selectedSupplier) {
      toast.error('Selected supplier does not exist')
      return false
    }
    
    if (selectedSupplier.status !== 'Active') {
      toast.error('Selected supplier must be Active')
      return false
    }

    if (!formData.unitPrice) {
      toast.error('Please enter unit price')
      return false
    }
    
    const unitPrice = parseFloat(formData.unitPrice)
    if (isNaN(unitPrice) || unitPrice < 0.01) {
      toast.error('Unit price must be a decimal number >= 0.01')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const purchaseData = {
      productId: formData.productId,
      supplierId: formData.supplierId,
      quantity: parseInt(formData.quantity),
      unitPrice: parseFloat(formData.unitPrice),
      purchaseDate: formData.purchaseDate
    }

    await onSave(purchaseData)
  }

  const selectedProduct = products.find(p => p.id === formData.productId)
  const selectedSupplier = suppliers.find(s => s.id === formData.supplierId)
  const activeSuppliers = suppliers.filter(s => s.status === 'Active')

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ShoppingCartIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Purchase' : 'Add New Purchase'}
                </h2>
                <p className="text-sm text-gray-500">
                  {isEditMode ? `Purchase #${purchase.id}` : 'Register a new product purchase'}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4 max-[548px]:grid-cols-1">
                <div className="relative">
                  <select
                    id="productId"
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className="w-full h-14 border border-slate-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 pt-6 pb-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md appearance-none"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {product.sku}
                      </option>
                    ))}
                  </select>
                  <label className="absolute left-4 top-2 text-xs font-medium text-slate-600 pointer-events-none">
                    Product *
                  </label>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <CubeIcon className="w-4 h-4 text-slate-400 min-w-[16px] flex-shrink-0" />
                  </div>
                </div>

                <FloatingLabelInput
                  id="quantity"
                  name="quantity"
                  type="number"
                  label="Quantity *"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                />

                <div className="relative">
                  <select
                    id="supplierId"
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleInputChange}
                    className="w-full h-14 border border-slate-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 pt-6 pb-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md appearance-none"
                    required
                  >
                    <option value="">Select Supplier</option>
                    {activeSuppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                  <label className="absolute left-4 top-2 text-xs font-medium text-slate-600 pointer-events-none">
                    Supplier *
                  </label>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <BuildingStorefrontIcon className="w-4 h-4 text-slate-400 min-w-[16px] flex-shrink-0" />
                  </div>
                </div>

                <FloatingLabelInput
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  label="Unit Price *"
                  value={formData.unitPrice}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full md:col-span-1">
                  <FloatingLabelInput
                    id="purchaseDate"
                    name="purchaseDate"
                    type="date"
                    label="Purchase Date *"
                    value={formData.purchaseDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {(selectedProduct || selectedSupplier || formData.quantity || formData.unitPrice) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50"
                >
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    Purchase Summary
                  </h3>
                  
                  <div className="grid grid-cols-1 min-[549px]:grid-cols-2 gap-4">
                    {selectedProduct && (
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Selected Product</p>
                        <p className="font-medium text-slate-900">{selectedProduct.name}</p>
                        <p className="text-xs text-slate-600">SKU: {selectedProduct.sku} | Stock: {selectedProduct.stock} units</p>
                      </div>
                    )}
                    
                    {selectedSupplier && (
                      <div>
                        <p className="text-xs text-slate-600 mb-1">Selected Supplier</p>
                        <p className="font-medium text-slate-900">{selectedSupplier.name}</p>
                        <p className="text-xs text-slate-600">Category: {selectedSupplier.category}</p>
                      </div>
                    )}
                  </div>
                  
                  {(formData.quantity && formData.unitPrice && 
                    parseFloat(formData.quantity || 0) > 0 && 
                    parseFloat(formData.unitPrice || 0) > 0) && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-slate-600">
                            {formData.quantity} units × ${formData.unitPrice}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ${(parseFloat(formData.unitPrice || 0) * parseFloat(formData.quantity || 0)).toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-600">Total Amount</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              
              <div className="flex flex-col min-[549px]:flex-row gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="flex-1 min-h-[48px] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-pulse h-4 w-16 bg-white/30 rounded"></div>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-4 h-4" />
                      {isEditMode ? 'Update Purchase' : 'Create Purchase'}
                    </>
                  )}
                </Button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 min-h-[48px] bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Custom hook for window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth })
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Set initial size

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

// Main Purchase Component
export default function Purchase() {
  const [purchases, setPurchases] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [currentTablePage, setCurrentTablePage] = useState(1)
  const tableItemsPerPage = 3
  const { width } = useWindowSize()
  
  // Modal states
  const [purchaseModal, setPurchaseModal] = useState({ 
    isOpen: false, 
    purchase: null, 
    isLoading: false 
  })
  const [detailModal, setDetailModal] = useState({ 
    isOpen: false, 
    purchase: null 
  })
  
  const { token } = useAuth()
  const { refreshStats } = useDashboard()

  // Load initial data
  useEffect(() => {
    loadAllData()
  }, [token])

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentTablePage(1)
  }, [searchTerm, supplierFilter, dateFilter])

  const clearFilters = () => {
    setSearchTerm('')
    setSupplierFilter('')
    setDateFilter('')
  }

  const loadAllData = async () => {
    if (!token) return
    
    try {
      setLoading(true)
      const [purchaseList, productList, supplierList] = await Promise.all([
        purchasesApi.getAll(),
        productsApi.getAll(),
        suppliersApi.getAll()
      ])
      
      setPurchases(purchaseList.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)))
      setProducts(productList)
      setSuppliers(supplierList)
    } catch (error) {
      console.error('Failed to load data:', error)
      const message = error.response?.data?.message || error.message || 'Failed to load purchase data'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const refreshPurchases = async () => {
    try {
      const purchaseList = await purchasesApi.getAll()
      setPurchases(purchaseList.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)))
    } catch (error) {
      console.error('Failed to refresh purchases:', error)
    }
  }

  // Modal handlers
  const handleCreatePurchase = () => {
    setPurchaseModal({ isOpen: true, purchase: null, isLoading: false })
  }

  const handleEditPurchase = (purchase) => {
    setPurchaseModal({ isOpen: true, purchase, isLoading: false })
  }

  const handleViewPurchase = (purchase) => {
    setDetailModal({ isOpen: true, purchase })
  }

  const handleClosePurchaseModal = () => {
    setPurchaseModal({ isOpen: false, purchase: null, isLoading: false })
  }

  const handleCloseDetailModal = () => {
    setDetailModal({ isOpen: false, purchase: null })
  }

  // CRUD operations
  const handleSavePurchase = async (purchaseData) => {
    setPurchaseModal(prev => ({ ...prev, isLoading: true }))
    const loadingToast = toast.loading(
      purchaseModal.purchase ? 'Updating purchase...' : 'Creating purchase...'
    )
    
    try {
      if (purchaseModal.purchase) {
        await purchasesApi.update(purchaseModal.purchase.id, purchaseData)
        toast.success('Purchase updated successfully', { id: loadingToast })
      } else {
        await purchasesApi.create(purchaseData)
        toast.success('Purchase created successfully', { id: loadingToast })
      }
      
      await refreshPurchases()
      await refreshStats()
      handleClosePurchaseModal()
    } catch (error) {
      console.error('Purchase operation error:', error)
      const message = error.response?.data?.message || error.message || 'An error occurred'
      toast.error(message, { id: loadingToast })
    } finally {
      setPurchaseModal(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleDeletePurchase = async (purchase) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-medium text-gray-900">Delete Purchase</p>
          <p className="text-sm text-gray-600 mt-1">
            Are you sure you want to delete this purchase? This action will reduce the stock for "{purchase.productName}" by {purchase.quantity} units and cannot be undone.
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id)
              const loadingToast = toast.loading('Deleting purchase...')
              
              try {
                await purchasesApi.delete(purchase.id)
                toast.success('Purchase deleted successfully', { id: loadingToast })
                await refreshPurchases()
                await refreshStats()
              } catch (error) {
                console.error('Delete purchase error:', error)
                const message = error.response?.data?.message || error.message || 'An error occurred'
                toast.error(message, { id: loadingToast })
              }
            }}
            className="px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      style: {
        background: 'white',
        color: 'black',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        maxWidth: '400px',
      }
    })
  }

  // Get unique suppliers for filter dropdown
  const uniqueSuppliers = [...new Set(purchases.map(purchase => purchase.supplierName).filter(Boolean))].sort()

  // Filter purchases based on search term and filters
  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = (purchase.productName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (purchase.supplierName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (purchase.productSku || '').toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSupplier = !supplierFilter || purchase.supplierName === supplierFilter
    
    const matchesDate = !dateFilter || 
                       (dateFilter === 'today' && new Date(purchase.purchaseDate).toDateString() === new Date().toDateString()) ||
                       (dateFilter === 'week' && new Date(purchase.purchaseDate) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                       (dateFilter === 'month' && new Date(purchase.purchaseDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    
    return matchesSearch && matchesSupplier && matchesDate
  })

  // Table view pagination (3 rows per page)
  const totalTablePages = Math.ceil(filteredPurchases.length / tableItemsPerPage)
  const tableStartIndex = (currentTablePage - 1) * tableItemsPerPage
  const tableEndIndex = tableStartIndex + tableItemsPerPage
  const currentTablePurchases = filteredPurchases.slice(tableStartIndex, tableEndIndex)

  if (loading) {
    return (
      <div className="w-full max-w-full overflow-x-hidden min-w-0">
        {/* Header Skeleton */}
        <div className="mb-6 mr-3 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="animate-pulse h-8 bg-slate-200 rounded w-64 mb-2"></div>
              <div className="animate-pulse h-4 bg-slate-200 rounded w-48"></div>
            </div>
            <div className="animate-pulse h-10 bg-slate-200 rounded-lg w-32"></div>
          </div>
        </div>

        {/* Search and Filters Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 mb-6">
          <div className="p-6 border-b border-white/20">
            <div className="space-y-4">
              <div className="animate-pulse h-10 bg-slate-200 rounded-lg w-full"></div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="animate-pulse h-8 bg-slate-200 rounded w-32"></div>
                <div className="animate-pulse h-8 bg-slate-200 rounded w-32"></div>
                <div className="animate-pulse h-8 bg-slate-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Table/Carousel Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30">
          {width > 1270 ? (
            <SkeletonPurchasesTable />
          ) : (
            <SkeletonCarousel />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="mb-6 mr-3 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl max-[2178px]:text-xl lg:text-3xl font-bold text-slate-900">
              Purchase Management
            </h1>
            <p className="text-xs sm:text-sm max-[2178px]:text-xs lg:text-base text-slate-600 mt-1">
              Manage your purchase records and inventory updates
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreatePurchase}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Add Purchase</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 mb-6">
        <div className="p-6 border-b border-white/20">
          <div className="space-y-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by product, supplier, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            
            {/* Filter Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600 whitespace-nowrap">Supplier:</label>
                <select
                  value={supplierFilter}
                  onChange={(e) => setSupplierFilter(e.target.value)}
                  className="px-3 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white"
                >
                  <option value="">All Suppliers</option>
                  {uniqueSuppliers.map(supplier => (
                    <option key={supplier} value={supplier}>{supplier}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600 whitespace-nowrap">Date Range:</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white"
                >
                  <option value="">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
              
              {(searchTerm || supplierFilter || dateFilter) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
              
              <div className="text-xs text-slate-500 ml-auto">
                {filteredPurchases.length} purchase{filteredPurchases.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30">
        {filteredPurchases.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || supplierFilter || dateFilter ? 'No purchases match your search criteria.' : 'Start by adding your first purchase.'}
            </p>
            <button
              onClick={handleCreatePurchase}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Purchase
            </button>
          </div>
        ) : (
          <div>
            {width > 1270 ? (
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Supplier</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Unit Price</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTablePurchases.map((purchase, index) => (
                    <motion.tr
                      key={purchase.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + (0.1 * index), duration: 1.2, ease: "easeOut" }}
                      className={`border-b border-slate-100 transition-all duration-200 hover:bg-slate-100/50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-slate-900 text-xs sm:text-sm">{purchase.productName}</div>
                          <div className="text-xs text-slate-500">SKU: {purchase.productSku}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs sm:text-sm text-slate-700">{purchase.supplierName}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs sm:text-sm font-semibold bg-blue-100 text-blue-800 rounded-full">
                          {purchase.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs sm:text-sm font-semibold bg-gray-100 text-gray-800 rounded-full">
                          ${purchase.unitPrice}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs sm:text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                          {formatCurrency(purchase.totalAmount || (purchase.quantity * purchase.unitPrice))}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs sm:text-sm text-slate-700">{new Date(purchase.purchaseDate).toLocaleDateString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleViewPurchase(purchase)}
                            className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            title="View details"
                          >
                            <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => handleEditPurchase(purchase)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Edit purchase"
                          >
                            <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePurchase(purchase)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete purchase"
                          >
                            <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination Controls */}
              {!loading && totalTablePages > 1 && (
                <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-xs sm:text-sm text-slate-500">
                    Showing {tableStartIndex + 1} to {Math.min(tableEndIndex, filteredPurchases.length)} of {filteredPurchases.length} purchases
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentTablePage(prev => Math.max(prev - 1, 1))}
                      disabled={currentTablePage === 1}
                      className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeftIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <span className="text-xs sm:text-sm text-slate-600">
                      Page {currentTablePage} of {totalTablePages}
                    </span>
                    <button
                      onClick={() => setCurrentTablePage(prev => Math.min(prev + 1, totalTablePages))}
                      disabled={currentTablePage === totalTablePages}
                      className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>
              )}
              </div>
            ) : (
              <div>
                <Carousel className="w-full">
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {filteredPurchases.map((purchase, index) => (
                      <CarouselItem key={purchase.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-4 h-full"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <ShoppingCartIcon className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2">
                          <CubeIcon className="w-4 h-4 text-blue-500" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 text-sm truncate">{purchase.productName}</p>
                            <p className="text-xs text-slate-600">SKU: {purchase.productSku}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <BuildingStorefrontIcon className="w-4 h-4 text-green-500" />
                          <div className="flex-1">
                            <p className="text-sm text-slate-900 truncate">{purchase.supplierName}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 rounded-lg p-2">
                            <p className="text-xs text-slate-600">Quantity</p>
                            <p className="font-semibold text-blue-600 text-sm">{purchase.quantity} units</p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2">
                            <p className="text-xs text-slate-600">Unit Price</p>
                            <p className="font-semibold text-green-600 text-sm">${purchase.unitPrice}</p>
                          </div>
                        </div>
                        
                        <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                          <p className="text-xs text-green-700">Total Amount</p>
                          <p className="font-bold text-green-600">${purchase.totalAmount}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleViewPurchase(purchase)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditPurchase(purchase)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePurchase(purchase)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex" />
                  <CarouselNext className="hidden sm:flex" />
                </Carousel>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {purchaseModal.isOpen && (
          <PurchaseModal
            isOpen={purchaseModal.isOpen}
            onClose={handleClosePurchaseModal}
            purchase={purchaseModal.purchase}
            onSave={handleSavePurchase}
            products={products}
            suppliers={suppliers}
            isLoading={purchaseModal.isLoading}
          />
        )}
        
        {detailModal.isOpen && (
          <PurchaseDetailModal
            isOpen={detailModal.isOpen}
            onClose={handleCloseDetailModal}
            purchase={detailModal.purchase}
            onEditPurchase={handleEditPurchase}
          />
        )}
      </AnimatePresence>
    </div>
  )
}