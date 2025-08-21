import { motion } from 'framer-motion'
import { 
  XMarkIcon,
  ShoppingCartIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

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

export default PurchaseDetailModal