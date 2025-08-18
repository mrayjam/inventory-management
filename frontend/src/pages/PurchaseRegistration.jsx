import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  ShoppingCartIcon,
  DocumentTextIcon,
  CubeIcon,
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  XMarkIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { FloatingLabelInput } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '../contexts/AuthContext'
import { mockApi } from '../services/mockApi'

const PurchaseInvoiceModal = ({ isOpen, onClose, purchase, invoice }) => {
  if (!isOpen || !purchase || !invoice) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DocumentTextIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Purchase Invoice</h2>
              <p className="text-sm text-slate-600">Invoice #{invoice.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-slate-600">Invoice Date</p>
                <p className="text-lg text-slate-900">{invoice.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Purchase ID</p>
                <p className="text-lg text-slate-900">{purchase.id}</p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Product Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Product:</span>
                <span className="font-medium text-slate-900">{purchase.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">SKU:</span>
                <span className="font-medium text-slate-900">{purchase.productSku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Supplier:</span>
                <span className="font-medium text-slate-900">{purchase.supplierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Quantity:</span>
                <span className="font-medium text-slate-900">{purchase.quantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Unit Price:</span>
                <span className="font-medium text-slate-900">${purchase.unitPrice}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-slate-900">Total Amount:</span>
              <span className="text-green-600">${invoice.totalAmount}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleIcon className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Stock Updated Successfully</span>
            </div>
            <p className="text-sm text-blue-700">
              Product stock has been increased by {purchase.quantity} units.
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose} className="px-6">
            Close Invoice
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function PurchaseRegistration() {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    supplierId: '',
    unitPrice: ''
  })
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [invoiceModal, setInvoiceModal] = useState({ isOpen: false, purchase: null, invoice: null })
  
  const { token } = useAuth()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [productList, supplierList] = await Promise.all([
          mockApi.products.getAll(token),
          mockApi.suppliers.getAll(token)
        ])
        setProducts(productList)
        setSuppliers(supplierList)
      } catch (error) {
        console.error('Failed to load data:', error)
        toast.error('Failed to load products and suppliers')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      loadData()
    }
  }, [token])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const selectedProduct = products.find(p => p.id === formData.productId)
  const selectedSupplier = suppliers.find(s => s.id === formData.supplierId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.productId || !formData.quantity || !formData.supplierId) {
      toast.error('Please fill in all required fields')
      return
    }

    if (parseInt(formData.quantity) <= 0) {
      toast.error('Quantity must be greater than 0')
      return
    }

    setSubmitting(true)
    const loadingToast = toast.loading('Processing purchase...')

    try {
      const purchaseData = {
        productId: formData.productId,
        quantity: parseInt(formData.quantity),
        supplierId: formData.supplierId,
        unitPrice: parseFloat(formData.unitPrice) || selectedProduct?.price || 0,
        productName: selectedProduct?.name,
        productSku: selectedProduct?.sku,
        supplierName: selectedSupplier?.name
      }

      const result = await mockApi.purchases.create(token, purchaseData)
      
      if (result.success) {
        toast.success('Purchase registered successfully!', { id: loadingToast })
        
        setInvoiceModal({
          isOpen: true,
          purchase: result.purchase,
          invoice: result.invoice
        })

        setFormData({
          productId: '',
          quantity: '',
          supplierId: '',
          unitPrice: ''
        })
      } else {
        toast.error(result.error || 'Failed to register purchase', { id: loadingToast })
      }
    } catch (error) {
      console.error('Purchase registration error:', error)
      toast.error('An error occurred while processing the purchase', { id: loadingToast })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl max-[1440px]:text-xl lg:text-3xl font-bold text-slate-900">Purchase Registration</h1>
        <p className="text-xs sm:text-sm max-[1440px]:text-xs lg:text-base text-slate-600 mt-1">Register new product purchases and update inventory</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/30 max-w-4xl mx-auto">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCartIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">New Purchase</h2>
              <p className="text-sm text-slate-600">Add products to inventory through purchase registration</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6  space-y-6">
          <div className="grid grid-cols-1 gap-6">
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
                  {suppliers.map(supplier => (
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
                label="Unit Price (Optional)"
                value={formData.unitPrice}
                onChange={handleInputChange}
                placeholder={selectedProduct ? `Default: $${selectedProduct.price}` : ''}
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
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Default Price:</span>
                      <span className="text-sm font-medium text-slate-900">${selectedProduct.price}</span>
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

              {formData.quantity && (selectedProduct || formData.unitPrice) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50/70 backdrop-blur-sm rounded-xl p-4 border border-green-200/50"
                >
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CurrencyDollarIcon className="w-4 h-4" />
                    Purchase Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Quantity:</span>
                      <span className="text-sm font-medium text-slate-900">{formData.quantity} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Unit Price:</span>
                      <span className="text-sm font-medium text-slate-900">
                        ${formData.unitPrice || selectedProduct?.price || 0}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-green-200 pt-2">
                      <span className="text-sm font-semibold text-slate-900">Total Amount:</span>
                      <span className="text-sm font-bold text-green-600">
                        ${((parseFloat(formData.unitPrice) || selectedProduct?.price || 0) * parseInt(formData.quantity || 0)).toFixed(2)}
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
              disabled={submitting}
              className="flex-1 min-h-[48px] flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="w-4 h-4" />
                  Register Purchase
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {invoiceModal.isOpen && (
          <PurchaseInvoiceModal
            isOpen={invoiceModal.isOpen}
            onClose={() => setInvoiceModal({ isOpen: false, purchase: null, invoice: null })}
            purchase={invoiceModal.purchase}
            invoice={invoiceModal.invoice}
          />
        )}
      </AnimatePresence>
    </div>
  )
}