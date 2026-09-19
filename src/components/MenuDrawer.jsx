import { useState } from "react";
import { Link } from "react-router-dom";
import { SITE, CATEGORIES } from "../data/site.js";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";

export default function MenuDrawer() {
  const { menuOpen, setMenuOpen } = useUI();
  const cart = useCart();
  const [open, setOpen] = useState(null);
  const close = () => setMenuOpen(false);

  return (
    <aside className={"drawer left" + (menuOpen ? " open" : "")}>
      <div className="drawer-head">
        <Link className="brand" style={{ fontSize: "var(--fs-3xl)" }} to="/" onClick={close}>{SITE.name}</Link>
        <button className="drawer-close" onClick={close}><i className="bi bi-x-lg"></i></button>
      </div>
      <div className="drawer-body">
        <div className="search-wrap">
          <input type="search" className="form-control" placeholder="Search for products..." />
          <button className="search-btn"><i className="bi bi-search"></i></button>
        </div>

        <div className="mobile-drawer-tiles">
          <Link className="tile" to="/track-order" onClick={close}><span className="ico">#</span><span className="lbl">Track</span></Link>
          <Link className="tile" to="/account" onClick={close}><span className="ico">@</span><span className="lbl">Account</span></Link>
          <Link className="tile" to="/cart" onClick={close}><span className="ico">{cart.count}</span><span className="lbl">Cart</span></Link>
        </div>

        <div className="drawer-label">Shop Categories</div>
        <ul className="m-cat-list">
          {CATEGORIES.map((c) => (
            <li key={c.slug} className={open === c.slug ? "open" : ""}>
              <div className="row-link" onClick={() => c.sub.length && setOpen(open === c.slug ? null : c.slug)}>
                <span className="sq"><i className="bi bi-journal"></i></span>
                <Link to="/shop" style={{ color: "inherit" }} onClick={close}>{c.name}</Link>
                {c.sub.length ? <i className="bi bi-chevron-down chev"></i> : null}
              </div>
              {c.sub.length ? (
                <ul className="sub">
                  {c.sub.map((s) => (<li key={s}><Link to="/shop" onClick={close}>{s}</Link></li>))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
