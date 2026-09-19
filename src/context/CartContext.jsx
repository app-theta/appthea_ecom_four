import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { findProduct } from "../data/site.js";

const KEY = "apptheta_cart_v1";
const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const api = useMemo(() => {
    const detailed = items
      .map((i) => ({ ...findProduct(i.id), qty: i.qty }))
      .filter((p) => p && p.id);

    return {
      items,
      detailed,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: detailed.reduce((s, p) => s + p.price * p.qty, 0),
      add: (id, qty = 1) =>
        setItems((prev) => {
          const hit = prev.find((i) => i.id === Number(id));
          return hit
            ? prev.map((i) => (i.id === Number(id) ? { ...i, qty: i.qty + qty } : i))
            : [...prev, { id: Number(id), qty }];
        }),
      setQty: (id, qty) =>
        setItems((prev) => prev.map((i) => (i.id === Number(id) ? { ...i, qty: Math.max(1, qty) } : i))),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== Number(id))),
      clear: () => setItems([])
    };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}
