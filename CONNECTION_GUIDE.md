# Frontend-Backend Connection Guide

This guide explains how your React frontend and Spring Boot backend are connected and how to use them.

## 🏗️ Architecture Overview

- **Frontend**: React app running on `http://localhost:3000` (Vite dev server)
- **Backend**: Spring Boot API running on `http://localhost:8081`
- **Database**: H2 (in-memory) by default, MySQL (XAMPP) available

## 🔌 How They're Connected

### 1. **Vite Proxy Configuration**
The frontend uses Vite's proxy feature to forward API requests to the backend. This is configured in `frontend/vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8081',
    changeOrigin: true,
  }
}
```

This means when your React app makes a request to `/api/products`, Vite automatically forwards it to `http://localhost:8081/api/products`.

### 2. **API Service Layer**
All API calls are centralized in `frontend/src/services/api.js`. This provides:
- Consistent error handling
- Automatic token management (for authentication)
- Reusable API functions

### 3. **CORS Configuration**
The backend has CORS enabled on all controllers with `@CrossOrigin(origins = "*")`, allowing the frontend to make requests from any origin.

## 🚀 Getting Started

### Step 1: Start the Backend
```bash
cd backend
./mvnw spring-boot:run
# Or on Windows:
mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8081`

### Step 2: Start the Frontend
```bash
cd frontend
npm install  # if you haven't already
npm run dev
```

The frontend will start on `http://localhost:3000`

### Step 3: Test the Connection
1. Open `http://localhost:3000` in your browser
2. Navigate to the authentication page
3. Try registering a new user or logging in
4. Check the browser console and network tab to see API calls

## 📡 Available API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{categoryId}` - Get products by category
- `GET /api/products/search?keyword={keyword}` - Search products
- `GET /api/products/bestsellers` - Get bestseller products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID

### Cart
- `GET /api/cart/{userId}` - Get user's cart
- `POST /api/cart/{userId}/add` - Add item to cart
- `PUT /api/cart/{userId}/items/{itemId}` - Update cart item
- `DELETE /api/cart/{userId}/items/{itemId}` - Remove cart item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/user/{userId}` - Get user's orders
- `GET /api/orders/{id}` - Get order by ID

### Delivery
- `GET /api/delivery/track/{trackingNumber}` - Track delivery

## 💾 Database Configuration

### Using H2 (Default - In-Memory)
The backend is currently configured to use H2, which is perfect for development. Data is stored in memory and will be lost when you restart the server.

### Switching to MySQL (XAMPP)
If you want to use MySQL with XAMPP:

1. **Start MySQL in XAMPP**
   - Open XAMPP Control Panel
   - Start MySQL service

2. **Update `backend/src/main/resources/application.properties`**
   - Comment out the H2 configuration
   - Uncomment the MySQL configuration:
   ```properties
   # Comment out H2:
   # spring.datasource.url=jdbc:h2:mem:stockease
   # spring.datasource.driverClassName=org.h2.Driver
   # spring.datasource.username=sa
   # spring.datasource.password=
   # spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
   
   # Uncomment MySQL:
   spring.datasource.url=jdbc:mysql://localhost:3306/stockease?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
   spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
   spring.datasource.username=root
   spring.datasource.password=
   spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
   ```

3. **Restart the Spring Boot application**
   - The database will be created automatically if it doesn't exist

## 🔧 Using the API in Your Components

### Example: Fetching Products
```javascript
import { productsAPI } from '../services/api';
import { useState, useEffect } from 'react';

function MyComponent() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchProducts();
  }, []);
  
  return <div>{/* render products */}</div>;
}
```

### Example: Authentication
```javascript
import { authAPI } from '../services/api';

const handleLogin = async (email, password) => {
  try {
    const response = await authAPI.login(email, password);
    // Token is automatically stored in localStorage
    // User info is also stored
    console.log('Login successful!', response);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

## 🐛 Troubleshooting

### Frontend can't connect to backend
1. **Check if backend is running**: Visit `http://localhost:8081/api/products` in your browser
2. **Check the port**: Make sure backend is on port 8081 (check `application.properties`)
3. **Check CORS**: Backend should have `@CrossOrigin(origins = "*")` on controllers
4. **Check proxy**: Verify `vite.config.js` has the proxy configuration

### CORS errors in browser
- The backend already has CORS enabled, but if you still see errors:
  - Make sure you're using the proxy (requests to `/api/*` not full URLs)
  - Check browser console for specific error messages

### Database connection issues (MySQL)
- Make sure MySQL is running in XAMPP
- Check MySQL port (default is 3306)
- Verify username/password in `application.properties`
- Check if database exists or if `createDatabaseIfNotExist=true` is in the URL

## 📝 Next Steps

1. **Add more API integrations**: Use the examples in `Products.jsx` and `AuthCard.jsx` as templates
2. **Add error handling**: The API service already handles errors, but you can add user-friendly messages
3. **Add loading states**: Show spinners while data is loading
4. **Add authentication guards**: Protect routes that require login
5. **Add token refresh**: Implement token refresh logic if your backend supports it

## 🎯 Best Practices

1. **Always use the API service**: Don't make direct `fetch` calls, use functions from `api.js`
2. **Handle errors gracefully**: Show user-friendly error messages
3. **Show loading states**: Let users know when data is being fetched
4. **Store tokens securely**: Currently using localStorage, consider httpOnly cookies for production
5. **Validate data**: Validate user input before sending to API










