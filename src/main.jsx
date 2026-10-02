import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles/style.css";

import App from "./App.jsx";
import { BusinessProvider } from "./context/BusinessContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { UIProvider } from "./context/UIContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <BusinessProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <UIProvider>
                <ChatProvider>
                  <App />
                </ChatProvider>
              </UIProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </BusinessProvider>
    </BrowserRouter>
  </React.StrictMode>
);
