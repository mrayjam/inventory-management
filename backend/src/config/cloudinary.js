import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

let cloudinaryStorage = null;

const getCloudinaryStorage = () => {
  if (!cloudinaryStorage) {
    console.log('Creating Cloudinary storage with environment variables:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'MISSING',
      api_key: process.env.CLOUDINARY_API_KEY || 'MISSING',
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'MISSING'
    });

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary environment variables are not properly configured');
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    cloudinaryStorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'inventory-products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' }
        ],
      },
    });

    console.log('Cloudinary storage created successfully');
  }
  return cloudinaryStorage;
};

export const createUpload = () => {
  return multer({ 
    storage: getCloudinaryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    }
  });
};

export const getCloudinary = () => {
  getCloudinaryStorage(); // Ensure cloudinary is configured
  return cloudinary;
};

export default cloudinary;