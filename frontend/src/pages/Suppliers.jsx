import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { suppliersApi } from '../services/apiClient'
import { SkeletonSuppliersTable, SkeletonCarousel } from '../components/Skeleton'
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

const SupplierModal = ({ isOpen, onClose, supplier, mode, onSupplierSaved }) => {
  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const supplierData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      category: formData.get('category'),
      status: formData.get('status')
    }
    
    try {
      if (mode === 'add') {
        await onSupplierSaved('create', null, supplierData)
      } else {
        await onSupplierSaved('update', supplier.id, supplierData)
      }
      onClose()
    } catch (error) {
      console.error('Failed to save supplier:', error)
    }
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
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalState, setModalState] = useState({ isOpen: false, supplier: null, mode: 'add' })
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTablePage, setCurrentTablePage] = useState(1)
  const tableItemsPerPage = 3

  const { token } = useAuth()

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        setLoading(true)
        const supplierList = await suppliersApi.getAll()
        setSuppliers(supplierList)
      } catch (error) {
        console.error('Failed to load suppliers:', error)
        toast.error('Failed to load suppliers')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      loadSuppliers()
    }
  }, [token])

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentTablePage(1)
  }, [searchTerm, categoryFilter, statusFilter])

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('')
    setStatusFilter('')
  }

  // Get unique categories for filter dropdown
  const categories = [...new Set(suppliers.map(supplier => supplier.category).filter(Boolean))].sort()

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = !categoryFilter || supplier.category === categoryFilter
    
    const matchesStatus = !statusFilter || supplier.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Pagination logic
  const totalTablePages = Math.ceil(filteredSuppliers.length / tableItemsPerPage)
  const tableStartIndex = (currentTablePage - 1) * tableItemsPerPage
  const tableEndIndex = tableStartIndex + tableItemsPerPage
  const currentTableSuppliers = filteredSuppliers.slice(tableStartIndex, tableEndIndex)

  const handleSupplierSaved = async (action, supplierId, supplierData) => {
    const loadingToast = toast.loading(`${action === 'create' ? 'Creating' : 'Updating'} supplier...`)
    
    try {
      if (action === 'create') {
        await suppliersApi.create(supplierData)
        toast.success('Supplier created successfully!', { id: loadingToast })
      } else if (action === 'update') {
        await suppliersApi.update(supplierId, supplierData)
        toast.success('Supplier updated successfully!', { id: loadingToast })
      }
      
      const updatedSuppliers = await suppliersApi.getAll()
      setSuppliers(updatedSuppliers)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to save supplier'
      toast.error(message, { id: loadingToast })
      throw error
    }
  }

  const handleDelete = async (supplierId) => {
    const supplier = suppliers.find(s => s.id === supplierId)
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
      await suppliersApi.delete(supplierId)
      const updatedSuppliers = await suppliersApi.getAll()
      setSuppliers(updatedSuppliers)
      toast.success('Supplier deleted successfully!', { id: loadingToast })
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete supplier'
      toast.error(message, { id: loadingToast })
    }
  }

  if (loading) {
    return (
      <div className="w-full max-w-full overflow-x-hidden min-w-0">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="animate-pulse h-8 bg-slate-200 rounded w-48 mb-2"></div>
              <div className="animate-pulse h-4 bg-slate-200 rounded w-64"></div>
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
          <SkeletonSuppliersTable />
        </div>

        {/* Mobile Carousel Skeleton */}
        <div className="max-[900px]:block min-[901px]:hidden">
          <SkeletonCarousel />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 mr-3 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl max-[2178px]:text-xl lg:text-3xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-xs sm:text-sm max-[2178px]:text-xs lg:text-base text-slate-600 mt-1">Manage your supplier relationships</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setModalState({ isOpen: true, supplier: null, mode: 'add' })}
          className="bg-blue-600 text-white px-3 sm:px-4 max-[2178px]:px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors text-xs sm:text-sm max-[2178px]:text-xs lg:text-base"
        >
          <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          Add Supplier
        </motion.button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30">
        <div className="p-6 border-b border-white/20">
          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            
            {/* Filter Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600 whitespace-nowrap">Category:</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-600 whitespace-nowrap">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs bg-white"
                >
                  <option value="">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              
              {(searchTerm || categoryFilter || statusFilter) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
              
              <div className="text-xs text-slate-500 ml-auto">
                {filteredSuppliers.length} supplier{filteredSuppliers.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </div>

        {/* Table View - Shows above 900px */}
        <div className="hidden min-[900px]:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentTableSuppliers.map((supplier, index) => (
                <motion.tr
                  key={supplier.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b border-slate-100 transition-all duration-200 hover:bg-slate-100/50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}
                >
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-slate-900 text-xs sm:text-sm">{supplier.name}</div>
                      <div className="text-xs text-slate-500">{supplier.category}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs sm:text-sm text-slate-700">{supplier.phone}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[150px]">{supplier.address}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs sm:text-sm text-slate-700 truncate max-w-[180px] block">{supplier.email}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center justify-center px-2 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                      supplier.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => setModalState({ isOpen: true, supplier, mode: 'edit' })}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Edit supplier"
                      >
                        <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete supplier"
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
                Showing {tableStartIndex + 1} to {Math.min(tableEndIndex, filteredSuppliers.length)} of {filteredSuppliers.length} suppliers
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

        {/* Carousel View - Shows at 900px and below */}
        <div className="max-[900px]:block min-[901px]:hidden px-3 sm:px-4 py-6">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full max-w-none"
          >
            <CarouselContent className="-ml-4">
              {filteredSuppliers.map((supplier, index) => (
                <CarouselItem key={supplier.id} className="pl-4 basis-full">
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
            <CarouselPrevious className="hidden" />
            <CarouselNext className="hidden" />
          </Carousel>
        </div>
      </div>

      <SupplierModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, supplier: null, mode: 'add' })}
        supplier={modalState.supplier}
        mode={modalState.mode}
        onSupplierSaved={handleSupplierSaved}
      />
    </div>
  )
}