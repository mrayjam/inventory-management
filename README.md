# Inventory Management System

A comprehensive full-stack inventory management application built with React and Node.js. This system provides complete inventory tracking capabilities including product management, supplier relationships, purchase tracking, sales recording, and advanced analytics.

## Features

### Core Functionality
- **Product Management**: Create, update, delete, and track inventory products with images
- **Supplier Management**: Maintain supplier information and relationships
- **Purchase Tracking**: Record and manage inventory purchases with cost tracking
- **Sales Recording**: Track product sales with customer information and revenue analytics
- **Stock Management**: Real-time inventory levels with low stock alerts

### Advanced Features
- **Analytics Dashboard**: Revenue tracking, sales trends, and performance metrics
- **Image Management**: Product image upload and storage via Cloudinary
- **User Authentication**: JWT-based authentication with role-based access control
- **Responsive Design**: Mobile-first design that works across all devices
- **Real-time Updates**: Dynamic dashboard with animated statistics
- **Data Export**: Advanced reporting and data visualization

### User Management
- **Role-based Access**: Admin and Super Admin roles with different permissions
- **Secure Authentication**: Password hashing and JWT token management
- **User Administration**: Super admins can create and manage admin users

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Smooth animations and micro-interactions
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **React Hot Toast**: User-friendly notification system
- **Heroicons**: Beautiful SVG icons
- **Recharts**: Data visualization and charting library

### Backend
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing and security
- **Cloudinary**: Cloud-based image storage and management
- **Multer**: Middleware for handling file uploads
- **Helmet**: Security middleware for Express
- **CORS**: Cross-origin resource sharing configuration

## Folder Structure

```
inventory-management/
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/           # Base UI components
│   │   │   ├── Layout.jsx    # Main layout wrapper
│   │   │   ├── StatCard.jsx  # Statistics display cards
│   │   │   └── ...
│   │   ├── contexts/         # React context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Application pages/routes
│   │   ├── services/         # API communication layer
│   │   └── lib/              # Utility functions
│   ├── public/               # Static assets
│   └── package.json
└── backend/                  # Node.js backend API
    ├── src/
    │   ├── config/           # Database and external service config
    │   ├── controllers/      # Route handlers and business logic
    │   ├── middleware/       # Authentication and validation
    │   ├── models/           # MongoDB schema definitions
    │   ├── routes/           # API route definitions
    │   ├── scripts/          # Database utilities and seeders
    │   └── server.js         # Main server entry point
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB installation)
- Cloudinary account for image storage

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env)**:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Frontend (.env)**:
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_NODE_ENV=development
```

### Installation Steps

1. **Clone and navigate to the project**:
   ```bash
   cd inventory-management
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

## Running the Project

### Development Mode

1. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:3001

2. **Start the frontend development server**:
   ```bash
   cd frontend
   npm run dev
   ```
   Application will run on http://localhost:5173

### Production Mode

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend in production**:
   ```bash
   cd backend
   npm start
   ```

## Database Setup & Seeding

### Initialize Database with Sample Data

1. **Create admin users**:
   ```bash
   cd backend
   npm run auth-seed
   ```

2. **Seed the database with sample data**:
   ```bash
   npm run seed
   ```

3. **Fresh database reset** (removes all data):
   ```bash
   npm run fresh
   ```

### Default Login Credentials
After running the seed scripts, use these credentials to login:

- **Admin**: admin@example.com / password123
- **Super Admin**: superadmin@example.com / password123

## Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Populate database with sample data
- `npm run auth-seed` - Create admin user accounts
- `npm run fresh` - Reset database (remove all data)
- `npm run migrate-purchases` - Run purchase data migration

### Frontend Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint code analysis

## API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/change-password` - Change user password

### Products
- `GET /api/products` - Retrieve all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product (with image upload)
- `PUT /api/products/:id` - Update existing product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/:id/history` - Get product change history

### Suppliers
- `GET /api/suppliers` - Retrieve all suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/:id` - Update supplier information
- `DELETE /api/suppliers/:id` - Delete supplier

### Purchases
- `GET /api/purchases` - Retrieve all purchase records
- `GET /api/purchases/:id` - Get purchase by ID
- `POST /api/purchases` - Record new purchase
- `PUT /api/purchases/:id` - Update purchase record
- `DELETE /api/purchases/:id` - Delete purchase record

### Sales
- `GET /api/sales` - Retrieve all sales records
- `GET /api/sales/:id` - Get sale by ID
- `POST /api/sales` - Record new sale
- `PUT /api/sales/:id` - Update sale record
- `DELETE /api/sales/:id` - Delete sale record

### Analytics
- `GET /api/analytics/revenue` - Get revenue and financial data
- `GET /api/analytics/top-selling` - Get top-selling products
- `GET /api/analytics/sales-trend` - Get sales trend data
- `GET /api/analytics/inventory-by-category` - Get inventory distribution
- `GET /api/analytics/advanced-metrics` - Get advanced business metrics

### User Management (Super Admin Only)
- `GET /api/users/admins` - Get all admin users
- `POST /api/users` - Create new admin user
- `POST /api/users/:id/reset-password` - Reset user password

### File Upload
- `POST /api/uploads/file` - Upload files to Cloudinary

## Usage Guidelines

### Authentication
All API endpoints except `/auth/login` require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Image Upload
Product images are uploaded to Cloudinary and automatically optimized. Supported formats: JPEG, PNG, WebP. Maximum file size: 5MB.

### Role-Based Access
- **Admin**: Can manage products, suppliers, purchases, and sales
- **Super Admin**: All admin permissions plus user management capabilities

### Data Validation
- All required fields are validated on both client and server sides
- SKU codes must be unique across products
- Email addresses must be unique for user accounts
- Numeric values are validated for appropriate ranges

### Performance Considerations
- Products are paginated for large inventories
- Images are lazy-loaded and cached
- Database queries are optimized with appropriate indexes
- Frontend uses code splitting for better load times

## Development Notes

### Code Structure
- ES6 modules used throughout both frontend and backend
- Async/await pattern for asynchronous operations
- Error boundaries and proper error handling
- Input validation and sanitization
- Security middleware and CORS configuration

### Database Schema
- MongoDB with Mongoose ODM
- Proper data relationships and references
- Indexes for performance optimization
- Schema validation and constraints

### Security Features
- Password hashing with bcryptjs
- JWT token-based authentication
- Request rate limiting
- Input sanitization
- File upload security measures

### Development Workflow
1. Use the development servers for hot reloading
2. Run linting before commits
3. Test API endpoints with provided sample data
4. Use browser dev tools for frontend debugging
5. Monitor server logs for backend issues

## Troubleshooting

### Common Issues
- **Database Connection**: Verify MongoDB URI and network access
- **Image Upload**: Check Cloudinary credentials and file size limits
- **CORS Errors**: Ensure CORS_ORIGIN matches frontend URL
- **Authentication**: Verify JWT_SECRET is set and tokens are not expired

### Performance Optimization
- Enable gzip compression in production
- Use environment-specific configurations
- Implement proper caching strategies
- Monitor database query performance
- Optimize image sizes and formats