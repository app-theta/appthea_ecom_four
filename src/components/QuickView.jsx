import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { money } from "../data/site.js";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import Qty from "./Qty.jsx";

export default function QuickView() {
  const { quickView: p, setQuickView, setCartOpen } = useUI();
  const cart = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => { setQty(1); }, [p]);
  if (!p) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1100, background: "rgba(19,26,43,.55)",
        display: "grid", placeItems: "center", padding: 16, overflowY: "auto"
      }}
      onClick={(e) => { if (e.target === e.currentTarget) setQuickView(null); }}
    >
      <div className="qv-content position-relative bg-white" style={{ width: "100%", maxWidth: 920 }}>
        <button className="qv-close" onClick={() => setQuickView(null)}><i className="bi bi-x-lg"></i></button>
        <div className="qv-grid">
          <div className="qv-media"><img src={p.img} alt={p.name} /></div>
          <div className="qv-info">
            <div className="eyebrow">Featured product</div>
            <h3>{p.name}</h3>
            <div className="p-rating justify-content-start">★★★★★ <span className="count">0.0 (0 reviews)</span></div>
            <div className="price">{money(p.price)}</div>
            <p className="desc">{p.desc}</p>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <Qty value={qty} onChange={setQty} />
              <button
                className="btn btn-accent flex-grow-1"
                onClick={() => { cart.add(p.id, qty); setQuickView(null); setCartOpen(true); }}
              >
                <i className="bi bi-cart2"></i> Add to Cart
              </button>
            </div>
            <Link to={`/product/${p.id}`} onClick={() => setQuickView(null)}>View full product details →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
