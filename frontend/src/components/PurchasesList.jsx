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
  EyeIcon,
  ShoppingCartIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useDashboard } from '../contexts/DashboardContext'
import { mockApi } from '../services/mockApi'
import PurchaseDetailModal from './PurchaseDetailModal'
import PurchaseModal from './PurchaseModal'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              'Delete'
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const PurchasesList = () => {
  const [purchases, setPurchases] = useState([])
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [detailModal, setDetailModal] = useState({ isOpen: false, purchase: null })
  const [purchaseModal, setPurchaseModal] = useState({ isOpen: false, purchase: null, isLoading: false })
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, purchase: null, isLoading: false })
  
  const { token } = useAuth()
  const { refreshStats } = useDashboard()

  useEffect(() => {
    loadData()
  }, [token])

  const loadData = async () => {
    try {
      setLoading(true)
      const [purchaseList, productList, supplierList] = await Promise.all([
        mockApi.purchases.getAll(token),
        mockApi.products.getAll(token),
        mockApi.suppliers.getAll(token)
      ])
      
      // Sort by purchase date (newest first)
      setPurchases(purchaseList.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)))
      setProducts(productList)
      setSuppliers(supplierList)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load purchases')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePurchase = () => {
    setPurchaseModal({ isOpen: true, purchase: null, isLoading: false })
  }

  const handleEditPurchase = (purchase) => {
    setPurchaseModal({ isOpen: true, purchase, isLoading: false })
  }

  const handleViewPurchase = (purchase) => {
    setDetailModal({ isOpen: true, purchase })
  }

  const handleDeletePurchase = (purchase) => {
    setDeleteDialog({ isOpen: true, purchase, isLoading: false })
  }

  const handleSavePurchase = async (purchaseData) => {
    setPurchaseModal(prev => ({ ...prev, isLoading: true }))
    const loadingToast = toast.loading(purchaseModal.purchase ? 'Updating purchase...' : 'Creating purchase...')
    
    try {
      let result
      if (purchaseModal.purchase) {
        result = await mockApi.purchases.update(token, purchaseModal.purchase.id, purchaseData)
      } else {
        result = await mockApi.purchases.create(token, purchaseData)
      }
      
      if (result.success) {
        toast.success(result.message, { id: loadingToast })
        await loadData()
        await refreshStats()
        setPurchaseModal({ isOpen: false, purchase: null, isLoading: false })
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

  const confirmDelete = async () => {
    setDeleteDialog(prev => ({ ...prev, isLoading: true }))
    const loadingToast = toast.loading('Deleting purchase...')
    
    try {
      const result = await mockApi.purchases.delete(token, deleteDialog.purchase.id)
      if (result.success) {
        toast.success(result.message, { id: loadingToast })
        await loadData()
        await refreshStats()
        setDeleteDialog({ isOpen: false, purchase: null, isLoading: false })
      } else {
        toast.error(result.error || 'Failed to delete purchase', { id: loadingToast })
      }
    } catch (error) {
      console.error('Delete purchase error:', error)
      toast.error(error.message || 'An error occurred', { id: loadingToast })
    } finally {
      setDeleteDialog(prev => ({ ...prev, isLoading: false }))
    }
  }

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Purchases List</h2>
          <p className="text-sm text-slate-600">Manage your purchase records and inventory updates</p>
        </div>
        <button
          onClick={handleCreatePurchase}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Add Purchase</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search purchases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {filteredPurchases.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 p-8 text-center">
          <ShoppingCartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No purchases match your search criteria.' : 'Get started by registering your first purchase.'}
          </p>
          <button
            onClick={handleCreatePurchase}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register Purchase
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
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Quantity</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Supplier</th>
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
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                          {purchase.quantity} units
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-slate-900">{purchase.supplierName}</p>
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
        {detailModal.isOpen && (
          <PurchaseDetailModal
            isOpen={detailModal.isOpen}
            onClose={() => setDetailModal({ isOpen: false, purchase: null })}
            purchase={detailModal.purchase}
            onEditPurchase={handleEditPurchase}
          />
        )}
        
        {purchaseModal.isOpen && (
          <PurchaseModal
            isOpen={purchaseModal.isOpen}
            onClose={() => setPurchaseModal({ isOpen: false, purchase: null, isLoading: false })}
            purchase={purchaseModal.purchase}
            onSave={handleSavePurchase}
            products={products}
            suppliers={suppliers}
            isLoading={purchaseModal.isLoading}
          />
        )}
        
        {deleteDialog.isOpen && (
          <ConfirmDialog
            isOpen={deleteDialog.isOpen}
            onClose={() => setDeleteDialog({ isOpen: false, purchase: null, isLoading: false })}
            onConfirm={confirmDelete}
            title="Delete Purchase"
            message={`Are you sure you want to delete this purchase? This action will reduce the stock for "${deleteDialog.purchase?.productName}" by ${deleteDialog.purchase?.quantity} units and cannot be undone.`}
            isLoading={deleteDialog.isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default PurchasesList