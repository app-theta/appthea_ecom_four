import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useBusiness } from "../context/BusinessContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { categoryNavTree } from "../utils/categoryTree.js";

function Search() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const submit = (e) => {
    e.preventDefault();
    navigate(q.trim() ? `/shop?keyword=${encodeURIComponent(q.trim())}` : "/shop");
  };
  return (
    <form className="search-wrap" onSubmit={submit}>
      <input
        type="search"
        className="form-control"
        placeholder="Search for products..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit" className="search-btn" aria-label="Search"><i className="bi bi-search"></i></button>
    </form>
  );
}

export default function Header() {
  const cart = useCart();
  const { setCartOpen } = useUI();
  const { info, categories, features } = useBusiness();
  const wishlist = useWishlist();

  const navLinks = useMemo(() => [
    { label: "Home", to: "/" },
    ...(features.product_reels ? [{ label: "Reels", to: "/reels" }] : []),
    ...categoryNavTree(categories, { limit: 6 }),
  ], [categories, features.product_reels]);

  const brandName = info?.name || "AppTheta Ecom";

  return (
    <>
      <div className="topbar">
        <div className="marquee">
          {Array.from({ length: 8 }).map((_, i) => (
            <span className="marquee-item" key={i}>পুরো eCommerce Business Manage করুন একটি System থেকেই {brandName}<span className="dot"></span></span>
          ))}
        </div>
      </div>

      <header className="site-header">
        <div className="container-x header-inner">
          <Link className="brand" to="/">{brandName}</Link>
          <Search />
          <div className="header-actions">
            <Link className="icon-btn" to="/track-order" title="Track Order"><i className="bi bi-truck"></i></Link>
            {features.user_wishlist && (
              <Link className="icon-btn" to="/wishlist" title="Wishlist">
                <i className="bi bi-heart"></i><span className="badge-count">{wishlist.count}</span>
              </Link>
            )}
            <Link className="icon-btn" to="/account" title="My Account"><i className="bi bi-person"></i></Link>
            <button className="icon-btn" title="Cart" onClick={() => setCartOpen(true)}>
              <i className="bi bi-cart2"></i><span className="badge-count">{cart.count}</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="main-nav">
        <div className="container-x">
          <ul>
            {navLinks.map((n, i) => (
              <li key={i} className={n.children?.length ? "has-drop" : ""}>
                <Link to={n.to}>
                  {n.label}
                  {n.children?.length ? <i className="bi bi-chevron-down" style={{ fontSize: 12 }}></i> : null}
                </Link>
                {n.children?.length ? (
                  <ul className="drop">
                    {n.children.map((c) => (<li key={c.slug}><Link to={`/shop/${c.slug}`}>{c.name}</Link></li>))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mobile-header">
        <div className="bar">
          <Link className="icon-btn" to="/track-order"><i className="bi bi-truck"></i></Link>
          <Link className="brand" to="/">{brandName}</Link>
          <div className="d-flex gap-2">
            <Link className="icon-btn" to="/account"><i className="bi bi-person"></i></Link>
            <button className="icon-btn" onClick={() => setCartOpen(true)}>
              <i className="bi bi-cart2"></i><span className="badge-count">{cart.count}</span>
            </button>
          </div>
        </div>
        <div className="searchrow"><Search /></div>
      </div>
    </>
  );
}
