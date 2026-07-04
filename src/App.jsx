import { BrowserRouter } from "react-router-dom"
import AppRoutes from "./routes/AppRoutes"
import { CartProvider } from "./context/CartContext"
import { WishlistProvider } from "./context/WishlistContext"
import { ToastProvider } from "./context/ToastContext"
import { ToastContainer } from "./components/ui/Toast"
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            <AppRoutes />
            <ToastContainer />
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
