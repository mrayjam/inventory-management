import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  XMarkIcon,
  ShoppingCartIcon,
  CubeIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline'
import { FloatingLabelInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

const PurchaseModal = ({ 
  isOpen, 
  onClose, 
  purchase, 
  onSave, 
  products, 
  suppliers,
  isLoading 
}) => {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    supplierId: '',
    unitPrice: ''
  })
  
  const isEditMode = !!purchase

  useEffect(() => {
    if (purchase) {
      setFormData({
        productId: purchase.productId.toString(),
        quantity: purchase.quantity.toString(),
        supplierId: purchase.supplierId.toString(),
        unitPrice: purchase.unitPrice.toString()
      })
    } else {
      setFormData({
        productId: '',
        quantity: '',
        supplierId: '',
        unitPrice: ''
      })
    }
  }, [purchase])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.productId || !formData.quantity || !formData.supplierId || !formData.unitPrice) {
      toast.error('Please fill in all required fields')
      return
    }

    if (parseInt(formData.quantity) <= 0) {
      toast.error('Quantity must be greater than 0')
      return
    }

    if (parseFloat(formData.unitPrice) <= 0) {
      toast.error('Unit price must be greater than 0')
      return
    }

    const selectedProduct = products.find(p => p.id === parseInt(formData.productId))
    const selectedSupplier = suppliers.find(s => s.id === parseInt(formData.supplierId))

    const purchaseData = {
      productId: parseInt(formData.productId),
      quantity: parseInt(formData.quantity),
      supplierId: parseInt(formData.supplierId),
      unitPrice: parseFloat(formData.unitPrice),
      productName: selectedProduct?.name,
      productSku: selectedProduct?.sku,
      supplierName: selectedSupplier?.name
    }

    await onSave(purchaseData)
  }

  const selectedProduct = products.find(p => p.id === parseInt(formData.productId))
  const selectedSupplier = suppliers.find(s => s.id === parseInt(formData.supplierId))
  const activeSuppliers = suppliers.filter(s => s.status === 'Active')

  if (!isOpen) return null

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
        className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-sm sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
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
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Edit Purchase' : 'New Purchase'}
                </h2>
                <p className="text-sm text-gray-500">
                  {isEditMode ? `Purchase #${purchase.id}` : 'Register a new product purchase'}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="relative">
                    <select
                      name="productId"
                      value={formData.productId}
                      onChange={handleInputChange}
                      className="w-full h-14 border border-slate-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md appearance-none"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.sku}
                        </option>
                      ))}
                    </select>
                    <label className="absolute left-4 top-2 text-xs font-medium text-slate-600 pointer-events-none">
                      Product *
                    </label>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <CubeIcon className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <FloatingLabelInput
                    name="quantity"
                    type="number"
                    label="Quantity *"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />

                  <div className="relative">
                    <select
                      name="supplierId"
                      value={formData.supplierId}
                      onChange={handleInputChange}
                      className="w-full h-14 border border-slate-300 bg-white/80 backdrop-blur-sm rounded-xl px-4 pt-6 pb-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md appearance-none"
                      required
                    >
                      <option value="">Select Supplier</option>
                      {activeSuppliers.map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                    <label className="absolute left-4 top-2 text-xs font-medium text-slate-600 pointer-events-none">
                      Supplier *
                    </label>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <BuildingStorefrontIcon className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  <FloatingLabelInput
                    name="unitPrice"
                    type="number"
                    step="0.01"
                    min="0.01"
                    label="Unit Price *"
                    value={formData.unitPrice}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-6">
                  {selectedProduct && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-50/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50"
                    >
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <CubeIcon className="w-4 h-4" />
                        Selected Product
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Name:</span>
                          <span className="text-sm font-medium text-slate-900">{selectedProduct.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">SKU:</span>
                          <span className="text-sm font-medium text-slate-900">{selectedProduct.sku}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Category:</span>
                          <span className="text-sm font-medium text-slate-900">{selectedProduct.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Current Stock:</span>
                          <span className="text-sm font-medium text-slate-900">{selectedProduct.stock} units</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {selectedSupplier && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-50/70 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50"
                    >
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <BuildingStorefrontIcon className="w-4 h-4" />
                        Selected Supplier
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Name:</span>
                          <span className="text-sm font-medium text-slate-900">{selectedSupplier.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Category:</span>
                          <span className="text-sm font-medium text-slate-900">{selectedSupplier.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Status:</span>
                          <span className={`text-sm font-medium ${
                            selectedSupplier.status === 'Active' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {selectedSupplier.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {formData.quantity && formData.unitPrice && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50/70 backdrop-blur-sm rounded-xl p-4 border border-green-200/50"
                    >
                      <h3 className="font-semibold text-slate-900 mb-3">Purchase Summary</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Quantity:</span>
                          <span className="text-sm font-medium text-slate-900">{formData.quantity} units</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">Unit Price:</span>
                          <span className="text-sm font-medium text-slate-900">${formData.unitPrice}</span>
                        </div>
                        <div className="flex justify-between border-t border-green-200 pt-2">
                          <span className="text-sm font-semibold text-slate-900">Total Amount:</span>
                          <span className="text-sm font-bold text-green-600">
                            ${(parseFloat(formData.unitPrice || 0) * parseInt(formData.quantity || 0)).toFixed(2)}
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
                  disabled={isLoading}
                  className="flex-1 min-h-[48px] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-4 h-4" />
                      {isEditMode ? 'Update Purchase' : 'Create Purchase'}
                    </>
                  )}
                </Button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 min-h-[48px] bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PurchaseModal