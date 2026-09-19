import { useState } from "react";
import { PRODUCTS, CATEGORIES } from "../data/site.js";
import ProductCard from "../components/ProductCard.jsx";

export default function Shop() {
  const [open, setOpen] = useState("beauty");
  const [active, setActive] = useState("all");
  const list = active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === active);
  const shown = list.slice(0, 12);

  return (
    <section className="section">
      <div className="container-x">
        <div className="shop-hero mb-4">
          <img src="/assets/img/shop-hero.svg" alt="Shop banner" />
          <div className="overlay">
            <span className="crumb">Home / Shop</span>
            <h1>Shop</h1>
            <p>Browse all available products.</p>
          </div>
        </div>

        <div className="toolbar mb-4">
          <span className="count">Showing 1–{shown.length} of {list.length} products</span>
          <div className="sort-wrap">
            <i className="bi bi-funnel"></i>
            <select>
              <option>Latest Products</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Name: A–Z</option>
            </select>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-3">
            <div className="panel mb-4">
              <div className="panel-body">
                <h5 style={{ fontSize: "var(--fs-xl)", marginBottom: 12 }}>Categories</h5>
                <ul className="cat-list">
                  <li className={active === "all" ? "active" : ""}>
                    <span className="row-link" onClick={() => setActive("all")}>
                      <span>All Products</span><span className="badge-n">{PRODUCTS.length}</span>
                    </span>
                  </li>
                  {CATEGORIES.map((c) => (
                    <li key={c.slug} className={(open === c.slug ? "open " : "") + (active === c.slug ? "active" : "")}>
                      <span
                        className="row-link"
                        onClick={() => { setActive(c.slug); if (c.sub.length) setOpen(open === c.slug ? null : c.slug); }}
                      >
                        <span>{c.name}</span>
                        {c.sub.length ? <i className="bi bi-chevron-down chev"></i> : null}
                      </span>
                      {c.sub.length ? (
                        <ul className="sub">{c.sub.map((s) => (<li key={s}><a href="#">{s}</a></li>))}</ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="panel">
              <div className="panel-body">
                <h5 style={{ fontSize: "var(--fs-xl)", marginBottom: 16 }}>Price Range</h5>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label" style={{ fontWeight: 600, color: "var(--ink-soft)" }}>Minimum</label>
                    <input type="number" className="form-control" />
                  </div>
                  <div className="col-6">
                    <label className="form-label" style={{ fontWeight: 600, color: "var(--ink-soft)" }}>Maximum</label>
                    <input type="number" className="form-control" />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-accent flex-grow-1">Apply</button>
                  <button className="btn btn-soft" onClick={() => setActive("all")}>Reset</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="grid-products cols-4">
              {shown.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap mt-4">
              <span className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>
                Showing 1 to {shown.length} of {list.length} results
              </span>
              <div className="pagination-x">
                <a className="pg" href="#"><i className="bi bi-chevron-left"></i></a>
                <a className="pg active" href="#">1</a>
                <a className="pg" href="#">2</a>
                <a className="pg" href="#"><i className="bi bi-chevron-right"></i></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
