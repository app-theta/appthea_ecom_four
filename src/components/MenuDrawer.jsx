import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useBusiness } from "../context/BusinessContext.jsx";

export default function MenuDrawer() {
  const { menuOpen, setMenuOpen } = useUI();
  const cart = useCart();
  const { info, categories } = useBusiness();
  const [open, setOpen] = useState(null);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const close = () => setMenuOpen(false);

  const submitSearch = (e) => {
    e.preventDefault();
    close();
    navigate(q.trim() ? `/shop?keyword=${encodeURIComponent(q.trim())}` : "/shop");
  };

  const top = categories.filter((c) => !c.parent_id);

  return (
    <aside className={"drawer left" + (menuOpen ? " open" : "")}>
      <div className="drawer-head">
        <Link className="brand" style={{ fontSize: "var(--fs-3xl)" }} to="/" onClick={close}>{info?.name || "AppTheta Ecom"}</Link>
        <button className="drawer-close" aria-label="Close" onClick={close}><i className="bi bi-x-lg"></i></button>
      </div>
      <div className="drawer-body">
        <form className="search-wrap" onSubmit={submitSearch}>
          <input
            type="search"
            className="form-control"
            placeholder="Search for products..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="search-btn" aria-label="Search"><i className="bi bi-search"></i></button>
        </form>

        <div className="mobile-drawer-tiles">
          <Link className="tile" to="/track-order" onClick={close}><span className="ico">#</span><span className="lbl">Track</span></Link>
          <Link className="tile" to="/account" onClick={close}><span className="ico">@</span><span className="lbl">Account</span></Link>
          <Link className="tile" to="/cart" onClick={close}><span className="ico">{cart.count}</span><span className="lbl">Cart</span></Link>
        </div>

        <div className="drawer-label">Shop Categories</div>
        <ul className="m-cat-list">
          {top.map((c) => {
            const sub = categories.filter((x) => x.parent_id === c.id);
            return (
              <li key={c.slug} className={open === c.slug ? "open" : ""}>
                <div className="row-link" onClick={() => sub.length && setOpen(open === c.slug ? null : c.slug)}>
                  <span className="sq"><i className="bi bi-journal"></i></span>
                  <Link to={`/shop/${c.slug}`} style={{ color: "inherit" }} onClick={close}>{c.name}</Link>
                  {sub.length ? <i className="bi bi-chevron-down chev"></i> : null}
                </div>
                {sub.length ? (
                  <ul className="sub">
                    {sub.map((s) => (<li key={s.slug}><Link to={`/shop/${s.slug}`} onClick={close}>{s.name}</Link></li>))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
