"use client";

import { BusinessProvider } from "@/context/BusinessContext.jsx";
import { AuthProvider } from "@/context/AuthContext.jsx";
import { WishlistProvider } from "@/context/WishlistContext.jsx";
import { CartProvider } from "@/context/CartContext.jsx";
import { UIProvider } from "@/context/UIContext.jsx";
import { ChatProvider } from "@/context/ChatContext.jsx";
import Layout from "@/components/Layout.jsx";

/** Every browser-side store, around the header/footer shell. `initial` is the server's business read. */
export default function Providers({ initial, children }) {
  return (
    <BusinessProvider initial={initial}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <UIProvider>
              <ChatProvider>
                <Layout>{children}</Layout>
              </ChatProvider>
            </UIProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BusinessProvider>
  );
}
