# Deployment Guide - My Shop Angular + JSON Server

## 📁 Project Structure

```
my-shop2/
├── backend/                          # JSON Server Backend
│   ├── package.json                  # Backend dependencies & start script
│   └── db.json                       # Database with shops & products
├── src/
│   ├── environments/                 # Environment configurations
│   │   ├── environment.ts            # Development config
│   │   └── environment.prod.ts       # Production config
│   ├── app/
│   │   ├── guards/
│   │   │   └── auth.guard.ts         # Route protection
│   │   ├── pipes/
│   │   │   └── default-image.pipe.ts # Default product image
│   │   ├── components/
│   │   │   ├── header/
│   │   │   │   ├── header.ts         # Navigation with conditional links
│   │   │   │   └── header.html       # UI with auth-based visibility
│   │   │   └── scroll-to-top/
│   │   │       └── scroll-to-top.component.ts  # Scroll to top button
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   │   └── home.html         # Home page (no admin button)
│   │   │   ├── shops/
│   │   │   │   ├── shops.component.ts
│   │   │   │   ├── shop-detail/
│   │   │   │   └── product-detail/
│   │   │   └── favorites/
│   │   │       └── favorites.component.ts
│   │   ├── services/
│   │   │   ├── shop.service.ts       # Uses environment.apiUrl
│   │   │   ├── product.service.ts    # Uses environment.apiUrl
│   │   │   ├── favorites.service.ts
│   │   │   └── user.service.ts
│   │   ├── app.routes.ts             # Protected routes with AuthGuard
│   │   └── app.ts
│   └── ...
├── package.json                      # Frontend dependencies
├── angular.json                      # Angular CLI config
└── README.md
```

## 🚀 Deployment Instructions

### 1. Backend Deployment (Render)

#### Option A: Deploy to Render (Recommended)

1. **Push your code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Create New Web Service on Render**
   - Go to https://dashboard.render.com/
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure the Service**
   - **Name:** `my-shop-backend` (or your preferred name)
   - **Runtime:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Plan:** Free

4. **Set Environment Variables (if needed)**
   - None required for basic JSON Server

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the URL (e.g., `https://my-shop-backend.onrender.com`)

6. **Update Frontend Environment**
   - Edit `src/environments/environment.prod.ts`
   - Replace `apiUrl` with your Render URL:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://my-shop-backend.onrender.com'
};
```

#### Option B: Local/Development Backend

```bash
cd backend
npm install
npm start
# Server runs on http://localhost:3000
```

### 2. Frontend Deployment

#### Option A: Deploy to Netlify (Recommended)

1. **Build the Angular App**
```bash
npm install
npm run build -- --configuration production
```

2. **Deploy to Netlify**
   - Go to https://app.netlify.com/
   - Drag and drop the `dist/my-shop2/browser` folder
   - Or connect GitHub for auto-deploy

3. **Alternative: Netlify CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist/my-shop2/browser
```

#### Option B: Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

## 🔐 Features Implemented

### ✅ Route Protection & Access Control
- **Auth Guard** protects `/favorites` and `/admin` routes
- Non-logged-in users are redirected to `/login`
- Header shows Favorites/Admin links only when logged in
- Admin button removed from Home page

### ✅ Environment Configuration
- **Development:** `http://localhost:3000`
- **Production:** `https://my-json-server.onrender.com`
- Services automatically use correct API URL

### ✅ Default Product Image
- Shows "No Photo" placeholder when image is missing
- Applied to all product images across the app

### ✅ Scroll-to-Top Button
- Appears when scrolling down 300px
- Smooth scroll animation
- Fixed position bottom-right

### ✅ Favorites System
- Add/remove products from favorites
- Persisted in localStorage
- Favorites page with all saved items

## 📋 Environment Files

### Development (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

### Production (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://my-shop-backend.onrender.com'  // Replace with your URL
};
```

## 🛠️ API Endpoints

The JSON Server provides these endpoints:

```
GET    /users              # List all users
GET    /users/:id          # Get specific user
POST   /users              # Create user

GET    /shops              # List all shops
GET    /shops/:id          # Get specific shop
POST   /shops              # Create shop
PUT    /shops/:id          # Update shop
DELETE /shops/:id          # Delete shop

GET    /products           # List all products
GET    /products/:id       # Get specific product
GET    /products?shopId=1  # Filter by shop
POST   /products           # Create product
PUT    /products/:id       # Update product
DELETE /products/:id       # Delete product
```

## 🔧 Important Files Content

### Backend Package.json
```json
{
  "name": "json-server-backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "json-server --watch db.json --host 0.0.0.0 --port $PORT"
  },
  "dependencies": {
    "json-server": "^0.17.4"
  }
}
```

### Frontend Services

**Shop Service** (`src/app/services/shop.service.ts`)
```typescript
private apiUrl = `${environment.apiUrl}/shops`;
```

**Product Service** (`src/app/services/product.service.ts`)
```typescript
private apiUrl = `${environment.apiUrl}/products`;
```

### Auth Guard (`src/app/guards/auth.guard.ts`)
- Protects `/favorites` and `/admin` routes
- Redirects to `/login` if not authenticated

### App Routes (`src/app/app.routes.ts`)
```typescript
{
  path: 'favorites',
  loadComponent: () => import('./pages/favorites/favorites.component').then(m => m.FavoritesComponent),
  canActivate: [AuthGuard]
},
{
  path: 'admin',
  loadChildren: () => import('./pages/admin/admin.routes').then(m => m.adminRoutes),
  canActivate: [AuthGuard]
}
```

## 🧪 Testing Deployment

1. **Test Backend:**
```bash
curl https://your-backend.onrender.com/shops
curl https://your-backend.onrender.com/products
```

2. **Test Frontend:**
   - Open deployed frontend URL
   - Verify shops and products load
   - Test login functionality
   - Verify protected routes redirect when logged out
   - Test favorites functionality

## 📝 Sample Data Included

### Shops (5 shops)
1. TechWorld Electronics
2. Fashion Forward
3. Book Haven
4. Home Comfort
5. Sports Pro

### Products (25+ products)
- Electronics: iPhone, Samsung, MacBook, Headphones, iPad, Camera
- Clothing: Shirts, Dresses, Handbags, Sneakers, Coats, Scarves
- Books: Great Gatsby, Clean Code, History Encyclopedia, etc.
- Home: Bedding, Lamp, Diffuser, Vases, Camera, Towels
- Sports: Yoga Mat, Dumbbells, Tennis Racket, Helmet, Goggles, Basketball

## 🚨 Troubleshooting

### CORS Issues
If you get CORS errors:
1. Ensure backend is deployed and accessible
2. Check that `environment.prod.ts` has correct URL
3. Verify no trailing slash in API URL

### Build Errors
```bash
# Clean and rebuild
rm -rf dist
rm -rf node_modules
npm install
npm run build
```

### Backend Not Starting on Render
- Check that `backend/package.json` exists
- Verify `db.json` is in the backend folder
- Check Render logs for errors

## 🎯 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build -- --configuration production

# Start backend locally
cd backend && npm install && npm start
```

## 📱 Live Demo Structure

**Frontend:** https://your-shop-frontend.netlify.app
**Backend:** https://your-shop-backend.onrender.com

Both are connected and working together!

---

## ✅ Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Frontend `environment.prod.ts` updated with backend URL
- [ ] Frontend built successfully (`npm run build`)
- [ ] Frontend deployed to Netlify/Vercel
- [ ] Test all pages load correctly
- [ ] Test login/logout functionality
- [ ] Test protected routes (Favorites, Admin)
- [ ] Test adding products to favorites
- [ ] Verify images load (or show default)
- [ ] Test scroll-to-top button
- [ ] Test responsive design on mobile

---

**Your app is ready for deployment! 🚀**