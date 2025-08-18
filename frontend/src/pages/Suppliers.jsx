import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
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
  ChevronRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { FloatingLabelInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-xs sm:max-w-lg xl:max-w-2xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
        >
          <XMarkIcon className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="pr-8">
          <h2 className="text-lg sm:text-xl xl:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">
            {mode === 'add' ? 'Add Supplier' : 'Edit Supplier'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <FloatingLabelInput
            name="name"
            type="text"
            label="Company Name"
            defaultValue={supplier?.name || ''}
            required
            className="text-sm sm:text-base"
          />
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <FloatingLabelInput
              name="email"
              type="email"
              label="Email Address"
              defaultValue={supplier?.email || ''}
              required
              className="text-sm sm:text-base"
            />
            
            <FloatingLabelInput
              name="phone"
              type="tel"
              label="Phone Number"
              defaultValue={supplier?.phone || ''}
              required
              className="text-sm sm:text-base"
            />
          </div>
          
          <div className="relative">
            <textarea
              name="address"
              rows="3"
              defaultValue={supplier?.address || ''}
              className="w-full border border-slate-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 pt-6 pb-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md resize-none placeholder:text-transparent"
              placeholder="Address"
              required
            />
            <label className="absolute left-4 top-2 text-xs font-medium text-slate-600 pointer-events-none">
              Address
            </label>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <div className="relative">
              <select
                name="category"
                defaultValue={supplier?.category || ''}
                className="w-full h-14 border border-slate-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 pt-6 pb-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md appearance-none"
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
            
            <div className="relative">
              <select
                name="status"
                defaultValue={supplier?.status || 'Active'}
                className="w-full h-14 border border-slate-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 pt-6 pb-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md appearance-none"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <label className="absolute left-4 top-2 text-xs font-medium text-slate-600 pointer-events-none">
                Status
              </label>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              size="lg"
              className="flex-1 text-sm sm:text-base min-h-[48px]"
            >
              {mode === 'add' ? 'Add Supplier' : 'Update Supplier'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onClose}
              className="flex-1 text-sm sm:text-base min-h-[48px]"
            >
              Cancel
            </Button>
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

  const handleDelete = async (supplierId) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId)
    const supplierName = supplier?.name || 'this supplier'
    
    const confirmed = await new Promise((resolve) => {
      toast((t) => (
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-900">Confirm Deletion</p>
            <p className="text-sm text-gray-600">Delete "{supplierName}"?</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id)
                resolve(true)
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id)
                resolve(false)
              }}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
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

    const loadingToast = toast.loading('Deleting supplier...')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('API Call:', {
        endpoint: `DELETE /api/suppliers/${supplierId}`,
        headers: { 'Authorization': 'Bearer <token>' },
        request: null,
        response: { success: true, message: 'Supplier deleted successfully' }
      })
      
      toast.success('Supplier deleted successfully!', { id: loadingToast })
    } catch (error) {
      toast.error('Failed to delete supplier', { id: loadingToast })
    }
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl max-[1440px]:text-xl lg:text-3xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-xs sm:text-sm max-[1440px]:text-xs lg:text-base text-slate-600 mt-1">Manage your supplier relationships</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalState({ isOpen: true, supplier: null, mode: 'add' })}
          className="bg-blue-600 text-white px-3 sm:px-4 max-[1440px]:px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors text-xs sm:text-sm max-[1440px]:text-xs lg:text-base"
        >
          <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
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

        <div className="px-3 sm:px-4 lg:px-6 py-6">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-none"
          >
            <CarouselContent className="-ml-4">
              {filteredSuppliers.map((supplier, index) => (
                <CarouselItem key={supplier.id} className="pl-4 basis-[95%] sm:basis-[95%] md:basis-1/2 min-[1246px]:basis-1/3 max-[1245px]:basis-1/2 max-[775px]:basis-full">
                  <div className="h-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -8, scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                      className="bg-gradient-to-br from-white/95 to-slate-50/95 backdrop-blur-sm border border-white/40 rounded-2xl p-4 hover:shadow-2xl transition-all duration-500 h-full mx-auto max-w-sm min-w-0"
                    >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-base mb-2">{supplier.name}</h3>
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
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="w-10 h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-sm border border-white/40 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 -left-2 sm:-left-4 md:-left-6" />
            <CarouselNext className="w-10 h-10 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-sm border border-white/40 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 -right-2 sm:-right-4 md:-right-6" />
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