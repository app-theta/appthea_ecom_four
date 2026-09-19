import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { checkout as checkoutApi } from "../api/endpoints.js";
import { barcodePrice, productImages, primaryBarcode } from "../utils/product.js";

const KEY = "apptheta_cart_v1";
const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

/** Every line carries `total_price` (the authoritative amount sent to the
    API) plus `price` (a derived per-unit figure for display). Lines are
    keyed by product id - this design has no variant picker, so each product
    always resolves to its primary barcode and merges into one line. */
const read = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY)) || [];
    if (!Array.isArray(raw)) return [];
    return raw.map((i) => ({
      ...i,
      total_price: i.total_price != null ? i.total_price : round2(Number(i.price || 0) * Number(i.qty || 1)),
    }));
  } catch { return []; }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(read);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  /** `product` is a full product resource from the API (needs .id, .name,
      .barcodes/.barcode, .thumbnail) - price/image are resolved once here,
      not looked up again later, so a cart line survives the catalogue
      changing underneath it. */
  const add = useCallback((product, qty = 1) => {
    const barcode = primaryBarcode(product);
    const price = barcodePrice(barcode);
    setItems((prev) => {
      const hit = prev.find((i) => i.id === product.id);
      if (hit) {
        const nextQty = hit.qty + qty;
        return prev.map((i) => (i.id === product.id ? { ...i, qty: nextQty, total_price: round2(i.price * nextQty) } : i));
      }
      return [...prev, {
        id: product.id,
        product_id: product.id,
        barcode_id: barcode?.id ?? null,
        name: product.name,
        qty,
        price: price.now,
        oldPrice: price.was,
        image: productImages(product)[0],
        total_price: round2(price.now * qty),
      }];
    });
  }, []);

  const setQty = useCallback((id, qty) => {
    setItems((prev) => prev.map((i) => {
      if (i.id !== Number(id)) return i;
      const nextQty = Math.max(1, qty);
      return { ...i, qty: nextQty, total_price: round2(i.price * nextQty) };
    }));
  }, []);

  const remove = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== Number(id))), []);
  const clear = useCallback(() => setItems([]), []);

  const apiCart = useCallback(() => items.map((i) => ({
    type: "simple",
    product_id: i.product_id,
    barcode_id: i.barcode_id,
    quantity: i.qty,
    total_price: round2(i.total_price),
  })), [items]);

  /** POST cart/price - refreshes each line's total from the backend right
      before checkout, since the backend re-prices every line and rejects
      checkout on any mismatch. Returns whether anything actually changed. */
  const syncPrices = useCallback(async () => {
    if (!items.length) return { changed: false, data: null };
    try {
      const data = await checkoutApi.price(apiCart());
      const lines = Array.isArray(data?.cart) ? data.cart : Array.isArray(data?.items) ? data.items : null;
      if (!lines) return { changed: false, data };

      const next = items.map((line, idx) => {
        const server = lines[idx];
        const fresh = Number(server?.total_price ?? line.total_price);
        if (!(Math.abs(fresh - Number(line.total_price)) > 0.009)) return line;
        return { ...line, total_price: fresh, price: line.qty > 0 ? round2(fresh / line.qty) : fresh };
      });
      const changed = next.some((line, i) => line !== items[i]);
      if (changed) setItems(next);
      return { changed, data };
    } catch {
      return { changed: false, data: null };
    }
  }, [items, apiCart]);

  const api = useMemo(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + Number(i.total_price || 0), 0);
    return { items, detailed: items, count, subtotal, add, setQty, remove, clear, apiCart, syncPrices };
  }, [items, add, setQty, remove, clear, apiCart, syncPrices]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

const round2 = (n) => Math.round(Number(n) * 100) / 100;
