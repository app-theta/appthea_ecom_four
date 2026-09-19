import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import AccountOrders from "./pages/AccountOrders.jsx";
import AccountAddress from "./pages/AccountAddress.jsx";
import AccountProfile from "./pages/AccountProfile.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import OrderCancel from "./pages/OrderCancel.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Reels from "./pages/Reels.jsx";
import Policy from "./pages/Policy.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/account/orders" element={<ProtectedRoute><AccountOrders /></ProtectedRoute>} />
        <Route path="/account/address" element={<ProtectedRoute><AccountAddress /></ProtectedRoute>} />
        <Route path="/account/profile" element={<ProtectedRoute><AccountProfile /></ProtectedRoute>} />
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="/order/cancel" element={<OrderCancel />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/reels/:slug" element={<Reels />} />
        <Route path="/privacy" element={<Policy field="privacy_policy" title="Privacy Policy" />} />
        <Route path="/terms" element={<Policy field="terms_condition" title="Terms & Conditions" />} />
        <Route path="/shipping-policy" element={<Policy field="shipping_policy" title="Shipping Policy" />} />
        <Route path="/refund-policy" element={<Policy field="refund_policy" title="Refund Policy" />} />
        <Route path="/return-policy" element={<Policy field="return_policy" title="Return Policy" />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
