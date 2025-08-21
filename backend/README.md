# Inventory Management System - Backend API

Express.js backend API for the Inventory Management System with MongoDB integration.

## Features

- JWT Authentication & Authorization
- User Management (Admin & Super Admin roles)
- Product CRUD Operations with Stock Management
- Supplier Management
- Purchase Registration with Automatic Stock Updates
- Sales Recording with Stock Deduction
- Analytics & Reporting
- File Upload Support
- Request Validation & Error Handling
- Security Middleware (Helmet, CORS)

## Tech Stack

- **Node.js** with ES Modules
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **express-validator** - Input validation

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the `.env` file and update the values:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/inventory-management

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5174

# File Upload
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=5242880
```

### 3. Start MongoDB

Make sure MongoDB is running locally or update `MONGODB_URI` to point to your MongoDB instance.

### 4. Seed Database

Populate the database with initial data:

```bash
npm run seed
```

### 5. Start Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will be available at `http://localhost:3001/api`

## Default Login Credentials

After seeding the database:

- **Admin**: `admin@example.com` / `password123`
- **Super Admin**: `superadmin@example.com` / `password123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password

### Users (Super Admin Only)
- `POST /api/users` - Create admin user
- `GET /api/users/admins` - Get all admin users
- `POST /api/users/:userId/reset-password` - Reset user password

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier
- `GET /api/suppliers/:id` - Get supplier by ID
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

### Purchases
- `GET /api/purchases` - Get all purchases
- `POST /api/purchases` - Register purchase (increases stock)
- `GET /api/purchases/:id` - Get purchase by ID
- `PUT /api/purchases/:id` - Update purchase
- `DELETE /api/purchases/:id` - Delete purchase (reverts stock)

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Record sale (decreases stock)
- `GET /api/sales/:id` - Get sale by ID
- `PUT /api/sales/:id` - Update sale
- `DELETE /api/sales/:id` - Delete sale (reverts stock)

### Analytics
- `GET /api/analytics/revenue` - Get revenue analytics
- `GET /api/analytics/top-selling` - Get top selling products

### File Upload
- `POST /api/uploads/file` - Upload file

### Health Check
- `GET /api/health` - API health status

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Business Logic

### Stock Management
- Products start with 0 stock
- Stock increases through purchase registrations
- Stock decreases through sales recordings
- Stock changes are automatically handled when purchases/sales are updated or deleted

### User Roles
- **admin**: Can manage products, suppliers, purchases, sales
- **super_admin**: All admin permissions + user management

### Validation
- All endpoints include comprehensive input validation
- Proper error messages for validation failures
- MongoDB schema validation for data integrity

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   ├── productController.js # Product CRUD
│   │   ├── supplierController.js# Supplier CRUD
│   │   ├── purchaseController.js# Purchase operations
│   │   ├── saleController.js    # Sales operations
│   │   ├── analyticsController.js# Analytics & reporting
│   │   └── uploadController.js  # File upload
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   └── validation.js       # Request validation
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Product.js          # Product schema
│   │   ├── Supplier.js         # Supplier schema
│   │   ├── Purchase.js         # Purchase schema
│   │   └── Sale.js             # Sale schema
│   ├── routes/
│   │   ├── auth.js             # Auth routes
│   │   ├── users.js            # User routes
│   │   ├── products.js         # Product routes
│   │   ├── suppliers.js        # Supplier routes
│   │   ├── purchases.js        # Purchase routes
│   │   ├── sales.js            # Sales routes
│   │   ├── analytics.js        # Analytics routes
│   │   └── uploads.js          # Upload routes
│   ├── scripts/
│   │   └── seed.js             # Database seeding
│   └── server.js               # Main application
├── uploads/                    # File upload directory
├── .env                        # Environment variables
├── package.json
└── README.md
```

## Error Handling

The API provides consistent error responses:

```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Helmet security headers
- CORS protection
- Input validation and sanitization
- File upload restrictions
- Rate limiting ready (can be added with express-rate-limit)

## Development

### Adding New Endpoints

1. Create controller in `src/controllers/`
2. Add validation rules in `src/middleware/validation.js`
3. Create routes in `src/routes/`
4. Import and use routes in `src/server.js`

### Database Schema Changes

1. Update Mongoose models in `src/models/`
2. Update validation rules
3. Update seed data if needed
4. Test with existing data

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper `CORS_ORIGIN`
4. Set up MongoDB Atlas or managed MongoDB
5. Configure file upload to cloud storage
6. Set up proper logging
7. Configure reverse proxy (nginx)
8. Set up SSL/TLS certificates

## Contributing

1. Follow the existing code structure
2. Add validation for new endpoints
3. Include error handling
4. Update this README for new features
5. Test thoroughly before committing

## License

ISC