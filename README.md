# 🌿 Kashmir Aromatics - Premium E-Commerce Platform

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-3.4-38B2AC) ![WordPress](https://img.shields.io/badge/Headless-WordPress-21759B)

A premium, full-stack e-commerce web application designed for selling authentic Kashmiri essential oils, blends, and aromatics. Built using a **Headless architecture** with Next.js (App Router) on the frontend and WordPress (GraphQL) as the content management system.

## 🚀 Key Features

### 🛍️ Shopping Experience
- **Dynamic Product Listing:** Server-side rendered product feeds via GraphQL.
- **Smart Filtering System:**
  - Mobile-optimized **"Drawer" filter** to save screen space.
  - Integrated Sorting (Price, Date, Name).
  - Active filter state tracking with loading indicators.
- **Premium Product View:**
  - **Mobile Swipe Support:** Touch-optimized image gallery for mobile devices.
  - **Desktop Navigation:** Hover-activated arrow navigation.
  - Stock status indicators, dynamic pricing, and rich HTML description rendering.

### 🛒 Cart & Checkout
- **Persistent Cart:** State management via React Context + LocalStorage persistence.
- **Smart Checkout:**
  - **Pincode Lookup:** Auto-fills City and State based on Indian pincodes.
  - **Form Validation:** Real-time validation for phone numbers and emails.
- **Payment Integration:**
  - **Razorpay:** Seamless online payment gateway integration.
  - **COD:** Support for Cash on Delivery orders.

### 📦 Post-Purchase
- **Instant PDF Receipts:** - Custom-branded PDF receipt generation using `html-to-image` and `jspdf`.
  - Includes order summary, shipping details, and payment method.
- **Order Tracking:** - Dedicated tracking page to fetch live order status using Order ID and Email.
  - Visual status indicators (Processing, Shipped, Delivered).

## 🛠️ Tech Stack

**Frontend:**
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Custom "Premium" theme: Brand Gold/Black)
* **Icons:** Lucide React
* **State Management:** React Context API

**Backend / Services:**
* **CMS:** WordPress (Headless with WPGraphQL)
* **Data Fetching:** Apollo Client
* **Payments:** Razorpay
* **PDF Gen:** `html-to-image`, `jspdf`
* **Notifications:** `react-hot-toast`

## 📂 Project Structure

```bash
├── app/
│   ├── api/                # Next.js API Routes (Razorpay, Checkout, Tracking)
│   ├── checkout/           # Checkout flow logic
│   ├── order-confirmation/ # Receipt generation & Success page
│   ├── shop/               # Product listing with server-side filters
│   └── track-order/        # Order status checking page
├── components/
│   ├── Navbar.tsx          # Global navigation
│   ├── ProductView.tsx     # Client-side gallery logic (Swipe/Zoom)
│   ├── ShopFilters.tsx     # Mobile-optimized filter drawer
│   └── ProductCard.tsx     # Reusable product grid item
├── context/
│   └── CartContext.tsx     # Global cart state & persistence logic
├── lib/
│   ├── apolloClient.ts     # Apollo Client configuration
│   └── queries.ts          # GraphQL query definitions
└── public/                 # Static assets