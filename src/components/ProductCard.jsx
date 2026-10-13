import { Link, useNavigate } from "react-router-dom";
import { money } from "../utils/format.js";
import { headlinePrice, productImages, productInStock, ratingOf } from "../utils/product.js";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useBusiness } from "../context/BusinessContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function ProductCard({ product: p }) {
  const cart = useCart();
  const { setQuickView, setCartOpen } = useUI();
  const { isAuthed } = useAuth();
  const { currencySymbol, features } = useBusiness();
  const wishlist = useWishlist();
  const navigate = useNavigate();

  const price = headlinePrice(p);
  const dis = price.was > price.now ? Math.round(((price.was - price.now) / price.was) * 100) : 0;
  const inStock = productInStock(p);
  const rating = ratingOf(p);
  const wished = wishlist.has(p.id);
  const href = `/product/${p.slug}`;

  const onWish = (e) => {
    e.preventDefault();
    if (!isAuthed) { navigate("/login"); return; }
    wishlist.toggle(p.id).catch(() => {});
  };

  const addToCart = () => {
    cart.add(p, 1);
    if (features.open_cart) setCartOpen(true);
  };

  return (
    <div className="p-card">
      <div className="p-media">
        {dis ? <span className="p-badge">-{dis}%</span> : null}
        {p.campaign && inStock ? (
          <Link className="p-campaign" to={`/campaign/${p.campaign.slug}`} title={p.campaign.title}>
            <i className="bi bi-lightning-charge-fill"></i> {p.campaign.title}
          </Link>
        ) : null}
        {features.user_wishlist && (
          <button className={"p-wish" + (wished ? " is-on" : "")} title="Wishlist" aria-label="Wishlist" aria-pressed={wished} onClick={onWish}>
            <i className={"bi " + (wished ? "bi-heart-fill" : "bi-heart")}></i>
          </button>
        )}
        <button className="p-quick" title="Quick view" aria-label="Quick view" onClick={() => setQuickView(p)}>
          <i className="bi bi-eye"></i>
        </button>
        <Link to={href}><img src={productImages(p)[0]} alt={p.name} /></Link>
      </div>
      <div className="p-body">
        <h3 className="p-title">
          <Link to={href} style={{ color: "inherit" }}>{p.name}</Link>
        </h3>
        <div className="p-rating">★★★★★ <span className="count">({rating.count})</span></div>
        <span className={"stock-pill " + (inStock ? "in" : "out")}>{inStock ? "In Stock" : "Out of Stock"}</span>
        <div className="p-price">
          {price.was > 0 ? <span className="old">{money(price.was, currencySymbol)}</span> : null}
          <span className="now">{money(price.now, currencySymbol)}</span>
        </div>
        {inStock ? (
          <button className="btn btn-accent" onClick={addToCart}>
            <i className="bi bi-cart2"></i> কার্টে যোগ করুন
          </button>
        ) : (
          <Link className="btn btn-accent" to={href}>
            View Product <i className="bi bi-arrow-right"></i>
          </Link>
        )}
      </div>
    </div>
  );
}
