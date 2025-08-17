import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  EyeIcon,
  ClockIcon,
  Squares2X2Icon,
  RectangleGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { mockApi } from '../services/mockApi'


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
      className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
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
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64 object-cover rounded-t-xl"
            />
          </div>
          
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">${product.price}</p>
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
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-lg text-gray-900">{product.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Supplier</p>
                <p className="text-lg text-gray-900">{product.supplier}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            
            <div className="flex gap-3">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEditClick}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <PencilIcon className="w-4 h-4" />
                Edit Product
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewHistoryClick}
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
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
  if (!isOpen || !product) return null

  const mockHistory = [
    { id: 1, action: 'Created', user: 'John Doe', date: '2024-01-15', details: 'Product added to inventory' },
    { id: 2, action: 'Stock Updated', user: 'Jane Smith', date: '2024-01-20', details: 'Stock increased from 45 to 75 units' },
    { id: 3, action: 'Price Modified', user: 'John Doe', date: '2024-01-25', details: 'Price changed from $899.99 to $849.99' },
    { id: 4, action: 'Description Updated', user: 'Admin', date: '2024-02-01', details: 'Product description enhanced' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Product History</h2>
              <p className="text-sm text-slate-600">{product.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          {mockHistory.map((entry, index) => (
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
                    <span className="font-semibold text-slate-900">{entry.action}</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {entry.user}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{entry.details}</p>
                  <p className="text-xs text-slate-400">{entry.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const ProductModal = ({ isOpen, onClose, product, mode, onProductSaved }) => {
  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const productData = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      supplier: formData.get('supplier'),
      sku: formData.get('sku'),
      description: formData.get('description') || '',
      imageUrl: formData.get('imageUrl') || 'https://via.placeholder.com/300'
    }
    
    try {
      if (mode === 'add') {
        await onProductSaved('create', productData)
      } else {
        await onProductSaved('update', product.id, productData)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save product:', error)
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {mode === 'add' ? 'Add Product' : 'Edit Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={product?.name || ''}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={product?.category || ''}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home & Garden">Home & Garden</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                  <input
                    name="sku"
                    type="text"
                    defaultValue={product?.sku || ''}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={product?.price || ''}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                  <input
                    name="stock"
                    type="number"
                    defaultValue={product?.stock || ''}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                <input
                  name="supplier"
                  type="text"
                  defaultValue={product?.supplier || ''}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Image URL</label>
                <input
                  name="imageUrl"
                  type="url"
                  defaultValue={product?.imageUrl || ''}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="4"
                  defaultValue={product?.description || ''}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter product description..."
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {mode === 'add' ? 'Add Product' : 'Update Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-800 py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('table') // 'table' or 'cards'
  const [modalState, setModalState] = useState({ isOpen: false, product: null, mode: 'add' })
  const [detailModal, setDetailModal] = useState({ isOpen: false, product: null })
  const [historyModal, setHistoryModal] = useState({ isOpen: false, product: null })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const { token } = useAuth()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const productList = await mockApi.products.getAll(token)
        setProducts(productList)
      } catch (error) {
        console.error('Failed to load products:', error)
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
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleProductSaved = async (action, productId, productData) => {
    const loadingToast = toast.loading(`${action === 'create' ? 'Creating' : 'Updating'} product...`)
    
    try {
      if (action === 'create') {
        await mockApi.products.create(token, productData)
        toast.success('Product created successfully!', { id: loadingToast })
      } else if (action === 'update') {
        await mockApi.products.update(token, productId, productData)
        toast.success('Product updated successfully!', { id: loadingToast })
      }
      
      const updatedProducts = await mockApi.products.getAll(token)
      setProducts(updatedProducts)
    } catch (error) {
      toast.error(error.message || 'Failed to save product', { id: loadingToast })
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
      await mockApi.products.delete(token, productId)
      const updatedProducts = await mockApi.products.getAll(token)
      setProducts(updatedProducts)
      toast.success('Product deleted successfully!', { id: loadingToast })
    } catch (error) {
      toast.error(error.message || 'Failed to delete product', { id: loadingToast })
    }
  }

  const handleEditProduct = (product) => {
    setModalState({ isOpen: true, product, mode: 'edit' })
  }

  const handleViewHistory = (product) => {
    setHistoryModal({ isOpen: true, product })
    toast.success(`Viewing history for ${product.name}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-1">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg p-1 border border-white/30">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Table view"
            >
              <Squares2X2Icon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Card view"
            >
              <RectangleGroupIcon className="h-4 w-4" />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setModalState({ isOpen: true, product: null, mode: 'add' })}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            Add Product
          </motion.button>
        </div>
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

{viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Supplier</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
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
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.stock < 20 
                          ? 'bg-red-100 text-red-800' 
                          : product.stock < 50 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900">{product.supplier}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-4 py-6">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {filteredProducts.map((product, index) => (
                  <CarouselItem key={product.id} className="pl-2 basis-full md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                        className="bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-[420px]"
                      >
                      <div className="relative h-40 flex-shrink-0">
                        <img
                          src={product.imageUrl}
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
                      
                      <div className="p-3 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-slate-900 text-base truncate">{product.name}</h3>
                              <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                            </div>
                            <div className="text-right ml-2">
                              <p className="text-lg font-bold text-green-600">${product.price}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-sm text-slate-600">
                              <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                                <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="truncate">{product.category}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                              <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="truncate">{product.supplier}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-auto">
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setDetailModal({ isOpen: true, product })}
                            className="flex-1 text-gray-600 hover:text-gray-800 py-2 px-3 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-1"
                            title="View Details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setModalState({ isOpen: true, product, mode: 'edit' })}
                            className="flex-1 text-blue-600 hover:text-blue-800 py-2 px-3 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-1"
                            title="Edit Product"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product.id)}
                            className="flex-1 text-red-600 hover:text-red-800 py-2 px-3 rounded-lg hover:bg-red-50 transition-all duration-200 flex items-center justify-center gap-1"
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
          </div>
        )}
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