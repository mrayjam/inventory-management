import { useState, useCallback, useEffect, memo } from 'react'
import { useDropzone } from 'react-dropzone'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  PhotoIcon, 
  XMarkIcon, 
  CloudArrowUpIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'

const ImageUpload = ({ 
  onImagesChange, 
  existingImages = [], 
  maxImages = 5, 
  maxSizeInMB = 5 
}) => {
  const [selectedImages, setSelectedImages] = useState([])
  const [visibleExistingImages, setVisibleExistingImages] = useState(existingImages)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    setVisibleExistingImages(existingImages)
  }, [existingImages])

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setErrors([])
    
    if (rejectedFiles.length > 0) {
      const newErrors = rejectedFiles.map(rejected => {
        if (rejected.errors.some(error => error.code === 'file-too-large')) {
          return `${rejected.file.name} is too large. Maximum size is ${maxSizeInMB}MB.`
        }
        if (rejected.errors.some(error => error.code === 'file-invalid-type')) {
          return `${rejected.file.name} is not a valid image format.`
        }
        return `${rejected.file.name} was rejected.`
      })
      setErrors(newErrors)
    }

    if (acceptedFiles.length > 0) {
      const validFiles = acceptedFiles.filter(file => file instanceof File && file.size > 0)
      
      if (validFiles.length === 0) {
        setErrors(['No valid image files were selected.'])
        return
      }
      
      const totalImages = selectedImages.length + visibleExistingImages.length + validFiles.length
      
      if (totalImages > maxImages) {
        setErrors([`Maximum ${maxImages} images allowed. Please remove some images first.`])
        return
      }

      const newImages = validFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        id: `new-${Date.now()}-${Math.random()}`
      }))

      const updatedImages = [...selectedImages, ...newImages]
      setSelectedImages(updatedImages)
      
      const validFileObjects = updatedImages.map(img => img.file).filter(file => file instanceof File)
      console.log('ImageUpload - Sending', validFileObjects.length, 'valid File objects to parent')
      onImagesChange(validFileObjects)
    }
  }, [selectedImages, visibleExistingImages, maxImages, maxSizeInMB, onImagesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: maxSizeInMB * 1024 * 1024,
    multiple: true
  })

  const removeImage = (imageId) => {
    const updatedImages = selectedImages.filter(img => img.id !== imageId)
    setSelectedImages(updatedImages)
    
    const validFileObjects = updatedImages.map(img => img.file).filter(file => file instanceof File)
    console.log('ImageUpload - After removal, sending', validFileObjects.length, 'valid File objects to parent')
    onImagesChange(validFileObjects)
  }

  const removeExistingImage = (imagePublicId) => {
    const updatedVisibleImages = visibleExistingImages.filter(img => img.publicId !== imagePublicId)
    setVisibleExistingImages(updatedVisibleImages)
    onImagesChange(null, imagePublicId)
  }

  const totalImages = selectedImages.length + visibleExistingImages.length

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Product Images ({totalImages}/{maxImages})
        </label>
        {totalImages > 0 && (
          <span className="text-sm text-gray-500">
            Drag to reorder • Click to remove
          </span>
        )}
      </div>

      <motion.div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : totalImages >= maxImages
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        }`}
        whileHover={totalImages < maxImages ? { scale: 1.01 } : {}}
        whileTap={totalImages < maxImages ? { scale: 0.99 } : {}}
      >
        <input {...getInputProps()} disabled={totalImages >= maxImages} />
        
        <div className="flex flex-col items-center space-y-3">
          {isDragActive ? (
            <CloudArrowUpIcon className="h-12 w-12 text-indigo-500" />
          ) : (
            <PhotoIcon className={`h-12 w-12 ${totalImages >= maxImages ? 'text-gray-400' : 'text-gray-500'}`} />
          )}
          
          <div>
            <p className={`text-lg font-medium ${totalImages >= maxImages ? 'text-gray-400' : 'text-gray-700'}`}>
              {isDragActive 
                ? 'Drop images here' 
                : totalImages >= maxImages
                ? `Maximum ${maxImages} images reached`
                : 'Drag & drop images here'
              }
            </p>
            {totalImages < maxImages && (
              <p className="text-sm text-gray-500 mt-1">
                or click to browse • JPEG, PNG, WebP up to {maxSizeInMB}MB each
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-700">{error}</p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(visibleExistingImages.length > 0 || selectedImages.length > 0) && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Image Preview</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <AnimatePresence>
              {visibleExistingImages.map((image, index) => (
                <motion.div
                  key={`existing-${image.publicId || index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="relative group"
                >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image.url}
                    alt={`Existing ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingImage(image.publicId)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Current
                </div>
              </motion.div>
            ))}

            {selectedImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative group"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
                <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  New
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUpload