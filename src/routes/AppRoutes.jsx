import { Routes, Route } from "react-router-dom"

// Layouts
import PublicLayout from "@/components/layout/PublicLayout"
import AdminLayout from "@/components/layout/AdminLayout"

// Route Protection
import ProtectedRoute from "@/components/admin/ProtectedRoute"
import ClientProtectedRoute from "@/components/public/ClientProtectedRoute"

// Public Pages
import HomePage from "@/pages/public/HomePage"
import CategoriesPage from "@/pages/public/CategoriesPage"
import CategoryPage from "@/pages/public/CategoryPage"
import ProductPage from "@/pages/public/ProductPage"
import CartPage from "@/pages/public/CartPage"
import SearchPage from "@/pages/public/SearchPage"
import NotFoundPage from "@/pages/public/NotFoundPage"
import LoginPage from "@/pages/public/auth/LoginPage"
import RegisterPage from "@/pages/public/auth/RegisterPage"
import AccountPage from "@/pages/public/account/AccountPage"
import ClientOrdersPage from "@/pages/public/account/ClientOrdersPage"
import ClientOrderDetailPage from "@/pages/public/account/ClientOrderDetailPage"
import ClientWishlistPage from "@/pages/public/account/ClientWishlistPage"
import CheckoutPage from "@/pages/public/CheckoutPage"

// Admin Pages
import AdminLoginPage from "@/pages/admin/AdminLoginPage"
import DashboardPage from "@/pages/admin/DashboardPage"
import ProductsAdminPage from "@/pages/admin/ProductsAdminPage"
import CategoriesAdminPage from "@/pages/admin/CategoriesAdminPage"
import AdminProfilePage from "@/pages/admin/AdminProfilePage"
import OrdersAdminPage from "@/pages/admin/OrdersAdminPage"
import OrderDetailAdminPage from "@/pages/admin/OrderDetailAdminPage"

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes with PublicLayout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/products/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Client Routes */}
        <Route element={<ClientProtectedRoute />}>
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/orders" element={<ClientOrdersPage />} />
          <Route path="/account/orders/:id" element={<ClientOrderDetailPage />} />
          <Route path="/account/wishlist" element={<ClientWishlistPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Login (No layout) */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Routes protégées */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsAdminPage />} />
          <Route path="orders" element={<OrdersAdminPage />} />
          <Route path="orders/:id" element={<OrderDetailAdminPage />} />
          <Route path="categories" element={<CategoriesAdminPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>
      </Route>
    </Routes>
  )
}
