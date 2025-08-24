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
  MagnifyingGlassIcon,
  XMarkIcon,
  EyeIcon,
  ReceiptPercentIcon,
  CubeIcon,
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { salesApi, productsApi } from '../services/apiClient'

const SaleDetailModal = ({ isOpen, onClose, sale, onEditSale }) => {
  if (!isOpen || !sale) return null

  const handleEditClick = () => {
    onEditSale(sale)
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
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ReceiptPercentIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Sale Details</h2>
                <p className="text-sm text-gray-500">Sale #{sale.id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Product</p>
                <p className="text-lg font-semibold text-gray-900">{sale.productName}</p>
                <p className="text-sm text-gray-600">SKU: {sale.productSku}</p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Customer</p>
                <p className="text-lg text-gray-900">{sale.customer || 'Walk-in Customer'}</p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Quantity</p>
                <p className="text-lg font-semibold text-blue-600">{sale.quantity} units</p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Unit Price</p>
                <p className="text-lg font-semibold text-green-600">${sale.salePrice}</p>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Sale Date</p>
                <p className="text-lg text-gray-900">{new Date(sale.saleDate).toLocaleDateString()}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm font-medium text-green-700 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">${(sale.totalAmount || (sale.salePrice * sale.quantity)).toFixed(2)}</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEditClick}
                className="flex-1 bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <PencilIcon className="w-4 h-4" />
                Edit Sale
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-2 sm:py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                Close
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const SaleModal = ({ isOpen, onClose, sale, mode, onSaleSaved }) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    salePrice: '',
    customer: '',
    saleDate: ''
  })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const { token } = useAuth()

  useEffect(() => {
    if (isOpen) {
      const loadProducts = async () => {
        try {
          setLoading(true)
          const productList = await productsApi.getAll()
          console.log('Loaded products:', productList)
          const availableProducts = productList.filter(p => (p.stock || 0) > 0)
          console.log('Products with stock > 0:', availableProducts)
          
          if (availableProducts.length === 0 && productList.length > 0) {
            console.log('No products with stock, showing all products')
            setProducts(productList)
          } else {
            console.log('Setting products state with', availableProducts.length, 'items')
            setProducts(availableProducts)
          }
        } catch (error) {
          console.error('Failed to load products:', error)
          const message = error.response?.data?.message || error.message || 'Failed to load products'
          toast.error(message)
        } finally {
          setLoading(false)
        }
      }
      
      loadProducts()
      
      if (sale) {
        setFormData({
          productId: sale.productId || '',
          quantity: sale.quantity || '',
          salePrice: sale.salePrice || '',
          customer: sale.customer || '',
          saleDate: sale.saleDate ? new Date(sale.saleDate).toISOString().slice(0, 16) : ''
        })
      } else {
        setFormData({
          productId: '',
          quantity: '',
          salePrice: '',
          customer: '',
          saleDate: new Date().toISOString().slice(0, 16)
        })
      }
    }
  }, [isOpen, sale, token])

  const selectedProduct = products.find(p => String(p._id || p.id) === String(formData.productId))

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.productId || !formData.quantity || !formData.salePrice) {
      toast.error('Please fill in all required fields')
      return
    }

    if (parseInt(formData.quantity) <= 0) {
      toast.error('Quantity must be greater than 0')
      return
    }

    if (parseFloat(formData.salePrice) <= 0) {
      toast.error('Sale price must be greater than 0')
      return
    }

    if (selectedProduct && parseInt(formData.quantity) > selectedProduct.stock) {
      toast.error(`Insufficient stock. Available: ${selectedProduct.stock}`)
      return
    }

    setSubmitting(true)
    const loadingToast = toast.loading(`${mode === 'add' ? 'Recording' : 'Updating'} sale...`)

    try {
      const saleData = {
        productId: formData.productId,
        quantity: parseInt(formData.quantity),
        salePrice: parseFloat(formData.salePrice),
        customer: formData.customer,
        saleDate: formData.saleDate || new Date().toISOString(),
        productName: selectedProduct?.name,
        productSku: selectedProduct?.sku
      }

      if (mode === 'add') {
        await onSaleSaved('create', null, saleData)
        toast.success('Sale recorded successfully!', { id: loadingToast })
      } else {
        await onSaleSaved('update', sale.id, saleData)
        toast.success('Sale updated successfully!', { id: loadingToast })
      }
      
      onClose()
    } catch (error) {
      toast.error(error.message || `Failed to ${mode === 'add' ? 'record' : 'update'} sale`, { id: loadingToast })
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {mode === 'add' ? 'Record Sale' : 'Edit Sale'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4">
                <div className="relative">
                  <select
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    className="w-full h-14 border border-slate-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 pt-6 pb-2 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md appearance-none"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(product => (
                      <option key={product._id || product.id} value={product._id || product.id}>
                        {product.name} - {product.sku} (Stock: {product.stock || 0})
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
                  name="quantity"
                  type="number"
                  label="Quantity *"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  max={selectedProduct?.stock || 999999}
                  required
                />

                <FloatingLabelInput
                  name="salePrice"
                  type="number"
                  step="0.01"
                  min="0.01"
                  label="Sale Price per Unit *"
                  value={formData.salePrice}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-4">
                <FloatingLabelInput
                  name="customer"
                  type="text"
                  label="Customer Name"
                  value={formData.customer}
                  onChange={handleInputChange}
                />

                <div className="relative">
                  <input
                    name="saleDate"
                    type="datetime-local"
                    value={formData.saleDate}
                    onChange={handleInputChange}
                    className="w-full h-14 border border-slate-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md"
                  />
                  <label className="absolute left-4 top-2 text-xs font-medium text-slate-600 pointer-events-none">
                    Sale Date
                  </label>
                </div>

                {selectedProduct && formData.quantity && formData.salePrice && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50/70 backdrop-blur-sm rounded-xl p-4 border border-green-200/50"
                  >
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      Sale Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Product:</span>
                        <span className="text-sm font-medium text-slate-900">{selectedProduct.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Available Stock:</span>
                        <span className="text-sm font-medium text-slate-900">{selectedProduct.stock} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Quantity:</span>
                        <span className="text-sm font-medium text-slate-900">{formData.quantity} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Unit Price:</span>
                        <span className="text-sm font-medium text-slate-900">${formData.salePrice}</span>
                      </div>
                      <div className="flex justify-between border-t border-green-200 pt-2">
                        <span className="text-sm font-semibold text-slate-900">Total Amount:</span>
                        <span className="text-sm font-bold text-green-600">
                          ${(parseFloat(formData.salePrice || 0) * parseInt(formData.quantity || 0)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="flex-1 min-h-[48px] flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    {mode === 'add' ? 'Recording...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <ReceiptPercentIcon className="w-4 h-4" />
                    {mode === 'add' ? 'Record Sale' : 'Update Sale'}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={onClose}
                className="flex-1 min-h-[48px]"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}

export default function Sales() {
  const [searchTerm, setSearchTerm] = useState('')
  const [modalState, setModalState] = useState({ isOpen: false, sale: null, mode: 'add' })
  const [detailModal, setDetailModal] = useState({ isOpen: false, sale: null })
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTablePage, setCurrentTablePage] = useState(1)
  const tableItemsPerPage = 3

  const { token } = useAuth()

  useEffect(() => {
    const loadSales = async () => {
      try {
        setLoading(true)
        const salesList = await salesApi.getAll()
        setSales(salesList.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate)))
      } catch (error) {
        console.error('Failed to load sales:', error)
        const message = error.response?.data?.message || error.message || 'Failed to load sales'
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      loadSales()
    }
  }, [token])

  const filteredSales = sales.filter(sale =>
    sale.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.productSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sale.customer && sale.customer.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalTablePages = Math.ceil(filteredSales.length / tableItemsPerPage)
  const tableStartIndex = (currentTablePage - 1) * tableItemsPerPage
  const tableEndIndex = tableStartIndex + tableItemsPerPage
  const currentTableSales = filteredSales.slice(tableStartIndex, tableEndIndex)

  useEffect(() => {
    setCurrentTablePage(1)
  }, [searchTerm])

  const handleSaleSaved = async (action, saleId, saleData) => {
    try {
      if (action === 'create') {
        await salesApi.create(saleData)
      } else if (action === 'update') {
        await salesApi.update(saleId, saleData)
      }
      
      const updatedSales = await salesApi.getAll()
      setSales(updatedSales.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate)))
    } catch (error) {
      throw error
    }
  }

  const handleDelete = async (saleId) => {
    const sale = sales.find(s => s.id === saleId)
    const saleRef = sale ? `Sale #${sale.id}` : 'this sale'
    
    const confirmed = await new Promise((resolve) => {
      toast((t) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-900">Confirm Deletion</p>
            <p className="text-sm text-gray-600">Delete {saleRef}? Stock will be restored.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id)
                resolve(true)
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id)
                resolve(false)
              }}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ), {
        duration: Infinity,
        position: 'top-center',
      })
    })

    if (!confirmed) return

    const loadingToast = toast.loading('Deleting sale...')
    
    try {
      await salesApi.delete(saleId)
      const updatedSales = await salesApi.getAll()
      setSales(updatedSales.sort((a, b) => new Date(b.saleDate) - new Date(a.saleDate)))
      toast.success('Sale deleted successfully!', { id: loadingToast })
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete sale'
      toast.error(message, { id: loadingToast })
    }
  }

  const handleEditSale = (sale) => {
    setModalState({ isOpen: true, sale, mode: 'edit' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pr-2">
        <div>
          <h1 className="text-xl sm:text-2xl max-[1440px]:text-xl lg:text-3xl font-bold text-slate-900">Sales</h1>
          <p className="text-xs sm:text-sm max-[1440px]:text-xs lg:text-base text-slate-600 mt-1">Manage your sales transactions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalState({ isOpen: true, sale: null, mode: 'add' })}
          className="bg-blue-600 text-white px-3 sm:px-4 max-[1440px]:px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors text-xs sm:text-sm max-[1440px]:text-xs lg:text-base"
        >
          <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          Record Sale
        </motion.button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30">
        <div className="p-6 border-b border-white/20">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table View - Shows above 900px */}
        <div className="hidden min-[900px]:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentTableSales.map((sale, index) => (
                <motion.tr
                  key={sale.id || sale._id || `table-sale-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-900">{sale.productName}</div>
                      <div className="text-sm text-slate-500">SKU: {sale.productSku}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{sale.customer || 'Walk-in'}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{sale.quantity} units</td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600">${(sale.totalAmount || (sale.salePrice * sale.quantity)).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{new Date(sale.saleDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDetailModal({ isOpen: true, sale })}
                        className="text-gray-600 hover:text-gray-800 p-1"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setModalState({ isOpen: true, sale, mode: 'edit' })}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit Sale"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete Sale"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          {totalTablePages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Showing {tableStartIndex + 1} to {Math.min(tableEndIndex, filteredSales.length)} of {filteredSales.length} sales
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTablePage(prev => Math.max(prev - 1, 1))}
                  disabled={currentTablePage === 1}
                  className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <span className="text-sm text-slate-600">
                  Page {currentTablePage} of {totalTablePages}
                </span>
                <button
                  onClick={() => setCurrentTablePage(prev => Math.min(prev + 1, totalTablePages))}
                  disabled={currentTablePage === totalTablePages}
                  className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Carousel View - Shows at 900px and below */}
        <div className="max-[900px]:block min-[901px]:hidden px-3 sm:px-4 lg:px-6 py-6">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-none"
          >
            <CarouselContent className="-ml-4">
              {filteredSales.map((sale, index) => (
                <CarouselItem key={sale.id || sale._id || `carousel-sale-${index}`} className="pl-4 basis-full min-[694px]:basis-1/2">
                  <div className="h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                      className="bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-[300px] mx-auto max-w-sm min-w-0"
                    >
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-slate-900 text-lg">{sale.productName}</h3>
                              <p className="text-sm text-slate-500">{new Date(sale.saleDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-green-600">${(sale.totalAmount || (sale.salePrice * sale.quantity)).toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-slate-600">
                              <DocumentTextIcon className="w-4 h-4 mr-2" />
                              <span className="text-xs text-slate-500 truncate">SKU: {sale.productSku}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                              <UserIcon className="w-4 h-4 mr-2" />
                              <span className="truncate">{sale.customer || 'Walk-in Customer'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600">Quantity:</span>
                              <span className="font-medium text-slate-900">{sale.quantity} units</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-auto">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDetailModal({ isOpen: true, sale })}
                            className="flex-1 bg-slate-100 text-slate-700 py-2 px-3 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setModalState({ isOpen: true, sale, mode: 'edit' })}
                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                            title="Edit Sale"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(sale.id)}
                            className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                            title="Delete Sale"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex w-12 h-12 bg-white/95 backdrop-blur-sm border border-white/40 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 -left-6" />
            <CarouselNext className="hidden sm:flex w-12 h-12 bg-white/95 backdrop-blur-sm border border-white/40 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 -right-6" />
          </Carousel>
        </div>
      </div>

      <AnimatePresence>
        {detailModal.isOpen && (
          <SaleDetailModal
            isOpen={detailModal.isOpen}
            onClose={() => setDetailModal({ isOpen: false, sale: null })}
            sale={detailModal.sale}
            onEditSale={handleEditSale}
          />
        )}
      </AnimatePresence>

      <SaleModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, sale: null, mode: 'add' })}
        sale={modalState.sale}
        mode={modalState.mode}
        onSaleSaved={handleSaleSaved}
      />
    </div>
  )
}