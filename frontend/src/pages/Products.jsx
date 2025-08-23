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
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { productsApi } from '../services/apiClient'
import ImageUpload from '../components/ImageUpload'


const ProductDetailModal = ({ isOpen, onClose, product, onEditProduct, onViewHistory }) => {
  if (!isOpen || !product) return null

  const handleEditClick = () => {
    onEditProduct(product)
    onClose()
  }

  const handleViewHistoryClick = () => {
    onViewHistory(product)
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
          
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={product.images && product.images.length > 0 ? product.images[0].url : product.imageUrl || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-48 sm:h-64 object-cover rounded-t-xl"
            />
          </div>
          
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl sm:text-3xl font-bold text-green-600">${product.price}</p>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  product.stock < 20 
                    ? 'bg-red-100 text-red-800' 
                    : product.stock < 50 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {product.stock} in stock
                </span>
              </div>
            </div>
            
            <div className="mb-4 sm:mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-lg text-gray-900">{product.category}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEditClick}
                className="flex-1 bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <PencilIcon className="w-4 h-4" />
                Edit Product
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewHistoryClick}
                className="flex-1 border border-gray-300 text-gray-700 py-2 sm:py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                View History
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const ProductHistoryModal = ({ isOpen, onClose, product }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchHistory = async () => {
      if (isOpen && product) {
        try {
          setLoading(true)
          const historyData = await productsApi.getHistory(product.id)
          setHistory(historyData)
        } catch (error) {
          console.error('Failed to fetch product history:', error)
          toast.error('Failed to load product history')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchHistory()
  }, [isOpen, product])

  if (!isOpen || !product) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Product History</h2>
              <p className="text-xs sm:text-sm text-slate-600">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No history available for this product
              </div>
            ) : (
              history.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-slate-900 capitalize">
                          {entry.action.replace('_', ' ')}
                        </span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {entry.user}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-1">{entry.details}</p>
                      <p className="text-xs text-slate-400">{entry.date}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        <div className="mt-4 sm:mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const ProductModal = ({ isOpen, onClose, product, mode, onProductSaved }) => {
  const [selectedImages, setSelectedImages] = useState([])
  const [deletedImageIds, setDeletedImageIds] = useState([])

  useEffect(() => {
    if (!isOpen) {
      setSelectedImages([])
      setDeletedImageIds([])
    } else {
      setSelectedImages([])
      setDeletedImageIds([])
    }
  }, [isOpen, product])

  if (!isOpen) return null

  const handleImagesChange = (images, removedImageId) => {
    if (removedImageId) {
      setDeletedImageIds(prev => [...prev, removedImageId])
    } else if (images) {
      setSelectedImages(images)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formData = new FormData()
    
    formData.append('name', e.target.name.value)
    formData.append('category', e.target.category.value)
    formData.append('sku', e.target.sku.value)
    formData.append('description', e.target.description.value || '')
    
    if (deletedImageIds.length > 0) {
      formData.append('deletedImages', JSON.stringify(deletedImageIds))
    }
    
    const validFiles = (selectedImages || [])
      .filter(file => {
        const isValidFile = file instanceof File && file.size > 0 && file.type.startsWith('image/')
        if (!isValidFile && file) {
          console.warn('Invalid file object detected and filtered out:', file)
        }
        return isValidFile
      })
    
    console.log('Frontend - Processing', validFiles.length, 'valid image files')
    console.log('Frontend - Deleted image IDs:', deletedImageIds)
    
    validFiles.forEach((file) => {
      formData.append('images', file)
    })
    
    try {
      if (mode === 'add') {
        await onProductSaved('create', null, formData)
      } else {
        await onProductSaved('update', product.id, formData)
      }
      onClose()
      setSelectedImages([])
      setDeletedImageIds([])
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

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
        className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {mode === 'add' ? 'Add Product' : 'Edit Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-6">
              <FloatingLabelInput
                name="name"
                type="text"
                label="Product Name"
                defaultValue={product?.name || ''}
                required
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={product?.category || ''}
                    className="w-full h-14 border border-slate-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md appearance-none"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home & Garden">Home & Garden</option>
                  </select>
                  <label className="absolute left-4 top-2 text-xs font-medium text-slate-600 pointer-events-none">
                    Category
                  </label>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <FloatingLabelInput
                  name="sku"
                  type="text"
                  label="SKU"
                  defaultValue={product?.sku || ''}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="relative">
                <textarea
                  name="description"
                  rows="4"
                  defaultValue={product?.description || ''}
                  className="w-full border border-slate-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 pt-6 pb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md resize-none placeholder:text-transparent"
                  placeholder="Description"
                />
                <label className="absolute left-4 top-2 text-xs font-medium text-slate-600 pointer-events-none">
                  Description
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ImageUpload
              onImagesChange={handleImagesChange}
              existingImages={product?.images || []}
              maxImages={5}
              maxSizeInMB={5}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              size="lg"
              className="flex-1 min-h-[48px]"
            >
              {mode === 'add' ? 'Add Product' : 'Update Product'}
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
      </motion.div>
    </div>
  )
}

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('')
  const [modalState, setModalState] = useState({ isOpen: false, product: null, mode: 'add' })
  const [detailModal, setDetailModal] = useState({ isOpen: false, product: null })
  const [historyModal, setHistoryModal] = useState({ isOpen: false, product: null })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTablePage, setCurrentTablePage] = useState(1)
  const tableProductsPerPage = 3

  const { token } = useAuth()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const productList = await productsApi.getAll()
        setProducts(productList)
      } catch (error) {
        console.error('Failed to load products:', error)
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      loadProducts()
    }
  }, [token])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Table view pagination (3 rows per page)
  const totalTablePages = Math.ceil(filteredProducts.length / tableProductsPerPage)
  const tableStartIndex = (currentTablePage - 1) * tableProductsPerPage
  const tableEndIndex = tableStartIndex + tableProductsPerPage
  const currentTableProducts = filteredProducts.slice(tableStartIndex, tableEndIndex)

  useEffect(() => {
    setCurrentTablePage(1)
  }, [searchTerm])

  const handleProductSaved = async (action, productId, productData) => {
    const loadingToast = toast.loading(`${action === 'create' ? 'Creating' : 'Updating'} product...`)
    
    try {
      if (action === 'create') {
        await productsApi.create(productData)
        toast.success('Product created successfully!', { id: loadingToast })
      } else if (action === 'update') {
        await productsApi.update(productId, productData)
        toast.success('Product updated successfully!', { id: loadingToast })
      }
      
      const updatedProducts = await productsApi.getAll()
      setProducts(updatedProducts)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to save product'
      toast.error(message, { id: loadingToast })
      throw error
    }
  }

  const handleDelete = async (productId) => {
    const product = products.find(p => p.id === productId)
    const productName = product?.name || 'this product'
    
    const confirmed = await new Promise((resolve) => {
      toast((t) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-900">Confirm Deletion</p>
            <p className="text-sm text-gray-600">Delete "{productName}"?</p>
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

    const loadingToast = toast.loading('Deleting product...')
    
    try {
      await productsApi.delete(productId)
      const updatedProducts = await productsApi.getAll()
      setProducts(updatedProducts)
      toast.success('Product deleted successfully!', { id: loadingToast })
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete product'
      toast.error(message, { id: loadingToast })
    }
  }

  const handleEditProduct = (product) => {
    setModalState({ isOpen: true, product, mode: 'edit' })
  }

  const handleViewHistory = (product) => {
    setHistoryModal({ isOpen: true, product })
    toast.success(`Viewing history for ${product.name}`)
  }

 

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8 pr-2">
        <div>
          <h1 className="text-xl sm:text-2xl max-[1440px]:text-xl lg:text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-xs sm:text-sm max-[1440px]:text-xs lg:text-base text-slate-600 mt-1">Manage your product inventory</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalState({ isOpen: true, product: null, mode: 'add' })}
          className="bg-blue-600 text-white px-3 sm:px-4 max-[1440px]:px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors text-xs sm:text-sm max-[1440px]:text-xs lg:text-base"
        >
          <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          Add Product
        </motion.button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30">
        <div className="p-6 border-b border-white/20">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
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
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <tr key={`skeleton-${index}`} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-slate-200 rounded-lg"></div>
                        <div>
                          <div className="h-4 bg-slate-200 rounded w-24 mb-2"></div>
                          <div className="h-3 bg-slate-200 rounded w-16"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-12"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-slate-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <div className="h-6 w-6 bg-slate-200 rounded"></div>
                        <div className="h-6 w-6 bg-slate-200 rounded"></div>
                        <div className="h-6 w-6 bg-slate-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                currentTableProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0].url : product.imageUrl || 'https://via.placeholder.com/300'}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setDetailModal({ isOpen: true, product })}
                        />
                        <div>
                          <div className="font-medium text-slate-900">{product.name}</div>
                          <div className="text-sm text-slate-500">SKU: {product.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{product.category}</td>
                    <td className="px-6 py-4 text-sm text-slate-900">${product.price}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-slate-900">{product.stock}</span>
                        <span className="text-xs text-slate-500">units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setDetailModal({ isOpen: true, product })}
                          className="text-gray-600 hover:text-gray-800 p-1"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setModalState({ isOpen: true, product, mode: 'edit' })}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit Product"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete Product"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Pagination Controls - Only shows above 900px */}
          {!loading && totalTablePages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Showing {tableStartIndex + 1} to {Math.min(tableEndIndex, filteredProducts.length)} of {filteredProducts.length} products
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
          {loading ? (
            <div className="grid grid-cols-1 min-[694px]:grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={`carousel-skeleton-${index}`} className="animate-pulse">
                  <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden h-[420px] flex flex-col">
                    <div className="h-40 bg-slate-200"></div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        </div>
                        <div className="h-6 bg-slate-200 rounded w-16 ml-3"></div>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-slate-200 rounded-lg mr-3"></div>
                          <div className="h-4 bg-slate-200 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <div className="flex-1 h-12 bg-slate-200 rounded-lg"></div>
                        <div className="flex-1 h-12 bg-slate-200 rounded-lg"></div>
                        <div className="flex-1 h-12 bg-slate-200 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-none"
            >
              <CarouselContent className="-ml-4">
                {filteredProducts.map((product, index) => (
                <CarouselItem key={product.id} className="pl-4 basis-full min-[694px]:basis-1/2">
                  <div className="h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                      className="bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-[420px] mx-auto max-w-sm min-w-0"
                    >
                      <div className="relative h-40 flex-shrink-0">
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0].url : product.imageUrl || 'https://via.placeholder.com/300'}
                          alt={product.name}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setDetailModal({ isOpen: true, product })}
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            product.stock < 20 
                              ? 'bg-red-100 text-red-800 border border-red-200' 
                              : product.stock < 50 
                              ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
                              : 'bg-green-100 text-green-800 border border-green-200'
                          }`}>
                            {product.stock} in stock
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-900 text-lg truncate">{product.name}</h3>
                              <p className="text-sm text-slate-500">SKU: {product.sku}</p>
                            </div>
                            <div className="text-right ml-3">
                              <p className="text-xl font-bold text-green-600">${product.price}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center text-sm text-slate-600">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="truncate font-medium">{product.category}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-auto">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDetailModal({ isOpen: true, product })}
                            className="flex-1 bg-slate-100 text-slate-700 py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setModalState({ isOpen: true, product, mode: 'edit' })}
                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            title="Edit Product"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                            title="Delete Product"
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
              <CarouselPrevious className="w-12 h-12 bg-white/95 backdrop-blur-sm border border-white/40 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 -left-6" />
              <CarouselNext className="w-12 h-12 bg-white/95 backdrop-blur-sm border border-white/40 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 -right-6" />
            </Carousel>
          )}
        </div>
      </div>

      <AnimatePresence>
        {detailModal.isOpen && (
          <ProductDetailModal
            isOpen={detailModal.isOpen}
            onClose={() => setDetailModal({ isOpen: false, product: null })}
            product={detailModal.product}
            onEditProduct={handleEditProduct}
            onViewHistory={handleViewHistory}
          />
        )}
        
        {historyModal.isOpen && (
          <ProductHistoryModal
            isOpen={historyModal.isOpen}
            onClose={() => setHistoryModal({ isOpen: false, product: null })}
            product={historyModal.product}
          />
        )}
      </AnimatePresence>

      <ProductModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, product: null, mode: 'add' })}
        product={modalState.product}
        mode={modalState.mode}
        onProductSaved={handleProductSaved}
      />
    </div>
  )
}