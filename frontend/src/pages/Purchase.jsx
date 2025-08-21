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
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useDashboard } from '../contexts/DashboardContext'
import { mockApi } from '../services/mockApi'

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
                <p className="text-xl font-bold text-green-600">${purchase.totalAmount}</p>
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
    unitPrice: ''
  })
  
  const isEditMode = !!purchase

  useEffect(() => {
    if (purchase) {
      setFormData({
        productId: purchase.productId.toString(),
        quantity: purchase.quantity.toString(),
        supplierId: purchase.supplierId.toString(),
        unitPrice: purchase.unitPrice.toString()
      })
    } else {
      setFormData({
        productId: '',
        quantity: '',
        supplierId: '',
        unitPrice: ''
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
    
    const selectedProduct = products.find(p => p.id === parseInt(formData.productId))
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
    
    const selectedSupplier = suppliers.find(s => s.id === parseInt(formData.supplierId))
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
      toast.error('Unit price must be a decimal number ≥ 0.01')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const selectedProduct = products.find(p => p.id === parseInt(formData.productId))
    const selectedSupplier = suppliers.find(s => s.id === parseInt(formData.supplierId))

    const purchaseData = {
      productId: parseInt(formData.productId),
      quantity: parseInt(formData.quantity),
      supplierId: parseInt(formData.supplierId),
      unitPrice: parseFloat(formData.unitPrice),
      productName: selectedProduct?.name,
      productSku: selectedProduct?.sku,
      supplierName: selectedSupplier?.name
    }

    await onSave(purchaseData)
  }

  const selectedProduct = products.find(p => p.id === parseInt(formData.productId))
  const selectedSupplier = suppliers.find(s => s.id === parseInt(formData.supplierId))
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
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className="w-full h-14 border border-slate-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md appearance-none"
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
                    <CubeIcon className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <FloatingLabelInput
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
                    name="supplierId"
                    value={formData.supplierId}
                    onChange={handleInputChange}
                    className="w-full h-14 border border-slate-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md appearance-none"
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
                    <BuildingStorefrontIcon className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <FloatingLabelInput
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

              {(selectedProduct || selectedSupplier || (formData.quantity && formData.unitPrice)) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50"
                >
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    Purchase Summary
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  
                  {formData.quantity && formData.unitPrice && (
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-slate-600">
                            {formData.quantity} units × ${formData.unitPrice}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            ${(parseFloat(formData.unitPrice || 0) * parseInt(formData.quantity || 0)).toFixed(2)}
                          </p>
                          <p className="text-xs text-slate-600">Total Amount</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="flex-1 min-h-[48px] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
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

// Main Purchase Component
export default function Purchase() {
  const [purchases, setPurchases] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
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

  const loadAllData = async () => {
    if (!token) return
    
    try {
      setLoading(true)
      const [purchaseList, productList, supplierList] = await Promise.all([
        mockApi.purchases.getAll(token),
        mockApi.products.getAll(token),
        mockApi.suppliers.getAll(token)
      ])
      
      setPurchases(purchaseList.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)))
      setProducts(productList)
      setSuppliers(supplierList)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load purchase data')
    } finally {
      setLoading(false)
    }
  }

  const refreshPurchases = async () => {
    try {
      const purchaseList = await mockApi.purchases.getAll(token)
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
      let result
      if (purchaseModal.purchase) {
        result = await mockApi.purchases.update(token, purchaseModal.purchase.id, purchaseData)
      } else {
        result = await mockApi.purchases.create(token, purchaseData)
      }
      
      if (result.success) {
        toast.success(result.message, { id: loadingToast })
        await refreshPurchases()
        await refreshStats()
        handleClosePurchaseModal()
      } else {
        toast.error(result.error || 'Operation failed', { id: loadingToast })
      }
    } catch (error) {
      console.error('Purchase operation error:', error)
      toast.error(error.message || 'An error occurred', { id: loadingToast })
    } finally {
      setPurchaseModal(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleDeletePurchase = async (purchase) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this purchase? This action will reduce the stock for "${purchase.productName}" by ${purchase.quantity} units and cannot be undone.`
    )
    
    if (!confirmDelete) return
    
    const loadingToast = toast.loading('Deleting purchase...')
    
    try {
      const result = await mockApi.purchases.delete(token, purchase.id)
      if (result.success) {
        toast.success(result.message, { id: loadingToast })
        await refreshPurchases()
        await refreshStats()
      } else {
        toast.error(result.error || 'Failed to delete purchase', { id: loadingToast })
      }
    } catch (error) {
      console.error('Delete purchase error:', error)
      toast.error(error.message || 'An error occurred', { id: loadingToast })
    }
  }

  // Filter purchases based on search term
  const filteredPurchases = purchases.filter(purchase =>
    purchase.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.productSku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl max-[1440px]:text-xl lg:text-3xl font-bold text-slate-900">
              Purchase Management
            </h1>
            <p className="text-xs sm:text-sm max-[1440px]:text-xs lg:text-base text-slate-600 mt-1">
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

      {/* Search */}
      <div className="relative mb-6">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search purchases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
        />
      </div>

      {filteredPurchases.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-8 text-center">
          <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No purchases match your search criteria.' : 'Start by adding your first purchase.'}
          </p>
          <button
            onClick={handleCreatePurchase}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Purchase
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Product</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Supplier</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Quantity</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Unit Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchases.map((purchase, index) => (
                    <motion.tr
                      key={purchase.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-slate-900">{purchase.productName}</p>
                          <p className="text-sm text-slate-600">SKU: {purchase.productSku}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-slate-900">{purchase.supplierName}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                          {purchase.quantity} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-green-600 font-medium">${purchase.unitPrice}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-green-600 font-bold">${purchase.totalAmount}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-slate-900">{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewPurchase(purchase)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View details"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditPurchase(purchase)}
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                            title="Edit purchase"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePurchase(purchase)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete purchase"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Carousel View */}
          <div className="lg:hidden">
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
                            <p className="font-semibold text-slate-900 text-sm">Purchase #{purchase.id}</p>
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
        </>
      )}

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