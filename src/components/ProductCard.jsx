import { Link } from "react-router-dom";
import { money, discount } from "../data/site.js";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";

export default function ProductCard({ product: p }) {
  const cart = useCart();
  const { setQuickView, setCartOpen } = useUI();
  const dis = discount(p);

  return (
    <div className="p-card">
      <div className="p-media">
        {dis ? <span className="p-badge">-{dis}%</span> : null}
        <button className="p-quick" title="Quick view" onClick={() => setQuickView(p)}>
          <i className="bi bi-eye"></i>
        </button>
        <Link to={`/product/${p.id}`}><img src={p.img} alt={p.name} /></Link>
      </div>
      <div className="p-body">
        <h3 className="p-title">
          <Link to={`/product/${p.id}`} style={{ color: "inherit" }}>{p.name}</Link>
        </h3>
        <div className="p-rating">★★★★★ <span className="count">(0)</span></div>
        <span className={"stock-pill " + (p.stock ? "in" : "out")}>{p.stock ? "In Stock" : "Out of Stock"}</span>
        <div className="p-price">
          {p.old ? <span className="old">{money(p.old)}</span> : null}
          <span className="now">{money(p.price)}</span>
        </div>
        {p.stock ? (
          <button className="btn btn-accent" onClick={() => { cart.add(p.id, 1); setCartOpen(true); }}>
            <i className="bi bi-cart2"></i> কার্টে যোগ করুন
          </button>
        ) : (
          <Link className="btn btn-accent" to={`/product/${p.id}`}>
            View Product <i className="bi bi-arrow-right"></i>
          </Link>
        )}
      </div>
    </div>
  );
}
