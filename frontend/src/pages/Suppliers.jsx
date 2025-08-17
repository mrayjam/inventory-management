import { useState } from 'react'
import { motion } from 'framer-motion'
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
  EnvelopeIcon,
  PhoneIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
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
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
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

        <div className="p-6">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {filteredSuppliers.map((supplier, index) => (
                <CarouselItem key={supplier.id} className="pl-6 basis-full lg:basis-1/2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                    className="bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 h-full"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg mb-2 truncate">{supplier.name}</h3>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          supplier.status === 'Active' 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                            : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
                        }`}>
                          {supplier.status}
                        </span>
                      </div>
                      <div className="flex gap-2 ml-2">
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setModalState({ isOpen: true, supplier, mode: 'edit' })}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(supplier.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-slate-600 group">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                          <EnvelopeIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="truncate flex-1">{supplier.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-slate-600 group">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                          <PhoneIcon className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="truncate flex-1">{supplier.phone}</span>
                      </div>
                      <div className="bg-slate-50/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Category</p>
                        <p className="text-sm font-medium text-slate-700">{supplier.category}</p>
                      </div>
                      <div className="bg-slate-50/70 backdrop-blur-sm rounded-lg p-3 border border-slate-200/50">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Address</p>
                        <p className="text-sm text-slate-600 leading-relaxed">{supplier.address}</p>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="w-12 h-12 bg-white/95 backdrop-blur-sm border border-white/40 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 -left-6" />
            <CarouselNext className="w-12 h-12 bg-white/95 backdrop-blur-sm border border-white/40 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 -right-6" />
          </Carousel>
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