import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

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

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
              <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Edit Product
              </button>
              <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                View History
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const ProductModal = ({ isOpen, onClose, product, mode }) => {
  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('API Call:', {
      endpoint: mode === 'add' ? 'POST /api/products' : `PUT /api/products/${product?.id}`,
      headers: { 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json' },
      request: {
        name: e.target.name.value,
        category: e.target.category.value,
        price: parseFloat(e.target.price.value),
        stock: parseInt(e.target.stock.value),
        supplier: e.target.supplier.value,
        sku: e.target.sku.value
      },
      response: {
        success: true,
        data: { id: product?.id || Date.now(), ...Object.fromEntries(new FormData(e.target)) }
      }
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          {mode === 'add' ? 'Add Product' : 'Edit Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              name="name"
              type="text"
              defaultValue={product?.name || ''}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                defaultValue={product?.stock || ''}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
            <input
              name="sku"
              type="text"
              defaultValue={product?.sku || ''}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mode === 'add' ? 'Add Product' : 'Update Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-200 text-slate-800 py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors"
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
  const [modalState, setModalState] = useState({ isOpen: false, product: null, mode: 'add' })
  const [detailModal, setDetailModal] = useState({ isOpen: false, product: null })

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (productId) => {
    console.log('API Call:', {
      endpoint: `DELETE /api/products/${productId}`,
      headers: { 'Authorization': 'Bearer <token>' },
      request: null,
      response: { success: true, message: 'Product deleted successfully' }
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-600 mt-1">Manage your product inventory</p>
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
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
      </div>

      <ProductDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, product: null })}
        product={detailModal.product}
      />

      <ProductModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, product: null, mode: 'add' })}
        product={modalState.product}
        mode={modalState.mode}
      />
    </div>
  )
}