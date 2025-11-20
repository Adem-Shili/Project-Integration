# Testing Guide - StockEase Application

## ✅ What's Already Working

### 1. **Authentication System** ✓
- ✅ User Registration
- ✅ User Login
- ✅ Logout functionality
- ✅ Auth state persistence (survives page refresh)
- ✅ Header shows user info when logged in

### 2. **Products Page** ✓
- ✅ Fetches products from backend API
- ✅ Search functionality
- ✅ Category filtering
- ✅ Loading states
- ✅ Error handling

---

## 🧪 Testing Checklist

### **Test 1: Authentication Flow**

#### 1.1 Registration
- [ ] Go to `/authentifier` page
- [ ] Click "Sign Up" tab
- [ ] Fill in: Name, Email, Password, Confirm Password
- [ ] Check "I agree to terms"
- [ ] Click "Create Account"
- [ ] **Expected**: Success message, redirects to home, header shows your name and "Logout" button

#### 1.2 Login
- [ ] If logged out, click "Login" in header
- [ ] Enter email and password
- [ ] Click "Sign In"
- [ ] **Expected**: Success message, redirects to home, header shows your name

#### 1.3 Logout
- [ ] While logged in, click "Logout" button in header
- [ ] **Expected**: Redirects to home, header shows "Login" button again

#### 1.4 Persistence
- [ ] Log in
- [ ] Refresh the page (F5)
- [ ] **Expected**: Still logged in, header shows your name

---

### **Test 2: Products Page**

#### 2.1 View Products
- [ ] Navigate to `/products` page
- [ ] **Expected**: Products load from backend (may be empty if no data)
- [ ] Check browser console for any errors

#### 2.2 Search Products
- [ ] Type a search keyword in the search box
- [ ] Press Enter or click "Search"
- [ ] **Expected**: Products filtered by keyword

#### 2.3 Filter by Category
- [ ] Select a category from dropdown
- [ ] **Expected**: Products filtered by selected category
- [ ] Select "All Categories"
- [ ] **Expected**: All products shown again

#### 2.4 Empty State
- [ ] If no products exist, you should see "No products found" message

---

### **Test 3: Backend API Endpoints**

Test these directly in your browser or using a tool like Postman:

#### 3.1 Products API
- [ ] `GET http://localhost:8081/api/products`
  - **Expected**: Returns array of products (may be empty `[]`)
  
- [ ] `GET http://localhost:8081/api/products/bestsellers`
  - **Expected**: Returns bestseller products

#### 3.2 Categories API
- [ ] `GET http://localhost:8081/api/categories`
  - **Expected**: Returns array of categories (may be empty `[]`)

#### 3.3 Auth API
- [ ] `POST http://localhost:8081/api/auth/register`
  - Body: `{"name": "Test User", "email": "test@test.com", "password": "password123"}`
  - **Expected**: Returns user data with userId

- [ ] `POST http://localhost:8081/api/auth/login`
  - Body: `{"email": "test@test.com", "password": "password123"}`
  - **Expected**: Returns user data with userId

---

## ⚠️ What Needs More Work

### **1. Categories Page** (Not Connected Yet)
- **Current**: Uses hardcoded data
- **Needs**: Connect to `/api/categories` endpoint
- **Status**: API exists, frontend needs integration

### **2. Cart Page** (Not Connected Yet)
- **Current**: Uses hardcoded cart items
- **Needs**: 
  - Connect to `/api/cart/{userId}` to fetch user's cart
  - Add/remove/update cart items functionality
- **Status**: API exists, frontend needs integration

### **3. Delivery/Tracking Page** (Not Connected Yet)
- **Current**: Has form but doesn't submit
- **Needs**: Connect to `/api/delivery/track/{trackingNumber}`
- **Status**: API exists, frontend needs integration

### **4. Add Products to Cart** (Not Implemented)
- **Current**: "Add to Cart" buttons don't do anything
- **Needs**: 
  - Connect to `/api/cart/{userId}/add` endpoint
  - Update cart state after adding
- **Status**: API exists, frontend needs integration

---

## 🗄️ Database Testing

### **Check if Database Has Data**

Since you're using H2 (in-memory), the database starts empty each time you restart the backend.

#### Option 1: Check via H2 Console
1. Start your backend
2. Go to: `http://localhost:8081/h2-console`
3. Login with:
   - JDBC URL: `jdbc:h2:mem:stockease`
   - Username: `sa`
   - Password: (leave empty)
4. Run: `SELECT * FROM products;`
5. Run: `SELECT * FROM categories;`

#### Option 2: Add Test Data via API
You'll need to create products and categories. Currently, there's no admin endpoint, so you might need to:
- Add them directly via SQL in H2 console, OR
- Create a data seeder/initializer in Spring Boot

---

## 🐛 Common Issues & Solutions

### Issue: "No products found" on Products page
**Solution**: Database is empty. You need to add products first.

### Issue: Categories dropdown is empty
**Solution**: Database has no categories. Add categories first.

### Issue: Can't add to cart
**Solution**: Cart functionality not yet implemented in frontend.

### Issue: Backend returns empty arrays `[]`
**Solution**: This is normal if database is empty. You need to seed data.

---

## 📝 Next Steps (Priority Order)

1. **Add Sample Data to Database**
   - Create some categories
   - Create some products
   - This will make testing easier

2. **Connect Categories Page**
   - Fetch categories from API
   - Display them dynamically

3. **Implement Cart Functionality**
   - Add to cart from Products page
   - View cart items
   - Update quantities
   - Remove items

4. **Connect Delivery Tracking**
   - Implement tracking form submission
   - Display tracking results

5. **Add Protected Routes**
   - Require login for Cart, Payment pages
   - Redirect to login if not authenticated

---

## 🎯 Quick Test Right Now

1. **Test Authentication** (Should work):
   ```
   - Register a new account
   - Log out
   - Log back in
   - Refresh page (should stay logged in)
   ```

2. **Test Products Page** (May show empty):
   ```
   - Go to /products
   - Check browser console for API calls
   - Should see API request to /api/products
   ```

3. **Test Backend Directly**:
   ```
   - Open: http://localhost:8081/api/products
   - Should see: [] (empty array, which is normal)
   ```

---

## 💡 Tips

- **Check Browser Console**: Open DevTools (F12) → Console tab to see any errors
- **Check Network Tab**: See API requests and responses
- **Backend Logs**: Check your Spring Boot console for any errors
- **Database**: Remember H2 is in-memory, so data resets on backend restart

---

## ✅ Success Criteria

You'll know everything is working when:
- ✅ Can register and login
- ✅ Header shows user info when logged in
- ✅ Products page loads products from backend
- ✅ Can search and filter products
- ✅ Can add products to cart
- ✅ Cart shows items from backend
- ✅ Can track deliveries

Good luck testing! 🚀



