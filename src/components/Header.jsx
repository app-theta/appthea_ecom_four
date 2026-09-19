import { Link } from "react-router-dom";
import { SITE } from "../data/site.js";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";

function Search() {
  return (
    <div className="search-wrap">
      <input type="search" className="form-control" placeholder="Search for products..." />
      <button className="search-btn" aria-label="Search"><i className="bi bi-search"></i></button>
    </div>
  );
}

export default function Header() {
  const cart = useCart();
  const { setCartOpen } = useUI();

  return (
    <>
      <div className="topbar">
        <div className="marquee">
          {Array.from({ length: 8 }).map((_, i) => (
            <span className="marquee-item" key={i}>{SITE.marquee}<span className="dot"></span></span>
          ))}
        </div>
      </div>

      <header className="site-header">
        <div className="container-x header-inner">
          <Link className="brand" to="/">{SITE.name}</Link>
          <Search />
          <div className="header-actions">
            <Link className="icon-btn" to="/track-order" title="Track Order"><i className="bi bi-truck"></i></Link>
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
            {SITE.nav.map((n, i) => (
              <li key={i} className={n.children ? "has-drop" : ""}>
                <Link to={n.to}>
                  {n.label}
                  {n.hot ? <span className="nav-hot">Hot</span> : null}
                  {n.children ? <i className="bi bi-chevron-down" style={{ fontSize: 12 }}></i> : null}
                </Link>
                {n.children ? (
                  <ul className="drop">
                    {n.children.map((c, j) => (<li key={j}><Link to={c.to}>{c.label}</Link></li>))}
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
          <Link className="brand" to="/">{SITE.name}</Link>
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
