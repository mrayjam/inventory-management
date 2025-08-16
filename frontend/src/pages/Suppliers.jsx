import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  MagnifyingGlassIcon,
  EnvelopeIcon,
  PhoneIcon 
} from '@heroicons/react/24/outline'

const mockSuppliers = [
  { 
    id: 1, 
    name: 'TechCorp Solutions', 
    email: 'contact@techcorp.com', 
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Silicon Valley, CA 94000',
    category: 'Electronics',
    status: 'Active'
  },
  { 
    id: 2, 
    name: 'FashionHub Inc', 
    email: 'orders@fashionhub.com', 
    phone: '+1 (555) 234-5678',
    address: '456 Fashion Ave, New York, NY 10001',
    category: 'Clothing',
    status: 'Active'
  },
  { 
    id: 3, 
    name: 'BookWorld Publishing', 
    email: 'sales@bookworld.com', 
    phone: '+1 (555) 345-6789',
    address: '789 Literature Blvd, Boston, MA 02101',
    category: 'Books',
    status: 'Inactive'
  },
  { 
    id: 4, 
    name: 'GreenThumb Gardens', 
    email: 'info@greenthumb.com', 
    phone: '+1 (555) 456-7890',
    address: '321 Garden Way, Portland, OR 97201',
    category: 'Home & Garden',
    status: 'Active'
  }
]

const SupplierModal = ({ isOpen, onClose, supplier, mode }) => {
  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('API Call:', {
      endpoint: mode === 'add' ? 'POST /api/suppliers' : `PUT /api/suppliers/${supplier?.id}`,
      headers: { 'Authorization': 'Bearer <token>', 'Content-Type': 'application/json' },
      request: {
        name: e.target.name.value,
        email: e.target.email.value,
        phone: e.target.phone.value,
        address: e.target.address.value,
        category: e.target.category.value,
        status: e.target.status.value
      },
      response: {
        success: true,
        data: { id: supplier?.id || Date.now(), ...Object.fromEntries(new FormData(e.target)) }
      }
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-lg mx-4"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          {mode === 'add' ? 'Add Supplier' : 'Edit Supplier'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
            <input
              name="name"
              type="text"
              defaultValue={supplier?.name || ''}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={supplier?.email || ''}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                name="phone"
                type="tel"
                defaultValue={supplier?.phone || ''}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
            <textarea
              name="address"
              rows="3"
              defaultValue={supplier?.address || ''}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                name="category"
                defaultValue={supplier?.category || ''}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                name="status"
                defaultValue={supplier?.status || 'Active'}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {mode === 'add' ? 'Add Supplier' : 'Update Supplier'}
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

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('')
  const [modalState, setModalState] = useState({ isOpen: false, supplier: null, mode: 'add' })

  const filteredSuppliers = mockSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (supplierId) => {
    console.log('API Call:', {
      endpoint: `DELETE /api/suppliers/${supplierId}`,
      headers: { 'Authorization': 'Bearer <token>' },
      request: null,
      response: { success: true, message: 'Supplier deleted successfully' }
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-slate-600 mt-1">Manage your supplier relationships</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalState({ isOpen: true, supplier: null, mode: 'add' })}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          Add Supplier
        </motion.button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {filteredSuppliers.map((supplier) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">{supplier.name}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                    supplier.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {supplier.status}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setModalState({ isOpen: true, supplier, mode: 'edit' })}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(supplier.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-slate-600">
                  <EnvelopeIcon className="h-4 w-4 mr-2" />
                  {supplier.email}
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {supplier.phone}
                </div>
                <div className="text-sm text-slate-600">
                  <p className="font-medium">Category:</p>
                  <p>{supplier.category}</p>
                </div>
                <div className="text-sm text-slate-600">
                  <p className="font-medium">Address:</p>
                  <p>{supplier.address}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <SupplierModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, supplier: null, mode: 'add' })}
        supplier={modalState.supplier}
        mode={modalState.mode}
      />
    </div>
  )
}