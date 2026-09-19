import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useBusiness } from "../context/BusinessContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { catalog } from "../api/endpoints.js";
import { paginated } from "../utils/product.js";
import ProductCard from "../components/ProductCard.jsx";

const SORTS = [
  { value: "latest", label: "Latest Products" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A–Z" },
];

export default function Shop() {
  const { category: categorySlug } = useParams();
  const { categories } = useBusiness();
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(categorySlug || null);
  const [sort, setSort] = useState("latest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceFilter, setPriceFilter] = useState({});
  const [page, setPage] = useState(1);

  const keyword = params.get("keyword") || "";
  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const topCategories = categories.filter((c) => !c.parent_id);

  useEffect(() => { setPage(1); setPriceFilter({}); setMinPrice(""); setMaxPrice(""); setSort("latest"); }, [categorySlug, keyword]);

  const query = useMemo(() => ({
    keyword: keyword || undefined,
    category_id: activeCategory?.id,
    sort,
    per_page: 12,
    page,
    ...priceFilter,
  }), [keyword, activeCategory?.id, sort, page, priceFilter]);

  const { data, loading, error, reload } = useAsync(
    (signal) => catalog.products(query, { signal }),
    [JSON.stringify(query)],
  );
  const { rows, lastPage, total } = paginated(data);

  const applyPrice = () => {
    const next = {};
    if (minPrice) next.min_price = minPrice;
    if (maxPrice) next.max_price = maxPrice;
    setPriceFilter(next);
    setPage(1);
  };

  const resetFilters = () => {
    setMinPrice(""); setMaxPrice(""); setPriceFilter({}); setSort("latest"); setPage(1);
    setParams({}, { replace: true });
  };

  const goPage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="section">
      <div className="container-x">
        <div className="shop-hero mb-4">
          <img src="/assets/img/shop-hero.svg" alt="Shop banner" />
          <div className="overlay">
            <span className="crumb">Home / Shop</span>
            <h1>{activeCategory ? activeCategory.name : "Shop"}</h1>
            <p>{keyword ? `Search results for "${keyword}"` : "Browse all available products."}</p>
          </div>
        </div>

        <div className="toolbar mb-4">
          <span className="count">
            {loading ? "Loading…" : `Showing 1–${rows.length} of ${total} products`}
          </span>
          <div className="sort-wrap">
            <i className="bi bi-funnel"></i>
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-3">
            <div className="panel mb-4">
              <div className="panel-body">
                <h5 style={{ fontSize: "var(--fs-xl)", marginBottom: 12 }}>Categories</h5>
                <ul className="cat-list">
                  <li className={!categorySlug ? "active" : ""}>
                    <a className="row-link" href="/shop">
                      <span>All Products</span>
                    </a>
                  </li>
                  {topCategories.map((c) => {
                    const sub = categories.filter((x) => x.parent_id === c.id);
                    return (
                      <li key={c.slug} className={(open === c.slug ? "open " : "") + (categorySlug === c.slug ? "active" : "")}>
                        <span
                          className="row-link"
                          onClick={() => { window.location.href = `/shop/${c.slug}`; }}
                        >
                          <span>{c.name}</span>
                          <span className="badge-n">{c.products_count ?? ""}</span>
                          {sub.length ? (
                            <i
                              className="bi bi-chevron-down chev"
                              onClick={(e) => { e.stopPropagation(); setOpen(open === c.slug ? null : c.slug); }}
                            ></i>
                          ) : null}
                        </span>
                        {sub.length ? (
                          <ul className="sub">
                            {sub.map((s) => (<li key={s.slug}><a href={`/shop/${s.slug}`}>{s.name}</a></li>))}
                          </ul>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="panel">
              <div className="panel-body">
                <h5 style={{ fontSize: "var(--fs-xl)", marginBottom: 16 }}>Price Range</h5>
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label" style={{ fontWeight: 600, color: "var(--ink-soft)" }}>Minimum</label>
                    <input type="number" className="form-control" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="form-label" style={{ fontWeight: 600, color: "var(--ink-soft)" }}>Maximum</label>
                    <input type="number" className="form-control" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-accent flex-grow-1" onClick={applyPrice}>Apply</button>
                  <button type="button" className="btn btn-soft" onClick={resetFilters}>Reset</button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            {loading ? (
              <div className="grid-products cols-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} style={{ aspectRatio: "1/1", background: "var(--cat-bg)", borderRadius: "var(--radius)" }} />
                ))}
              </div>
            ) : error ? (
              <div className="empty-note">
                {error.message} <button type="button" className="btn btn-soft ms-2" onClick={reload}>Retry</button>
              </div>
            ) : rows.length === 0 ? (
              <div className="empty-note">No products match these filters.</div>
            ) : (
              <div className="grid-products cols-4">
                {rows.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {lastPage > 1 && (
              <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap mt-4">
                <span className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>
                  Showing page {page} of {lastPage} ({total} results)
                </span>
                <div className="pagination-x">
                  <a className="pg" href="#" aria-label="Previous page" onClick={(e) => { e.preventDefault(); if (page > 1) goPage(page - 1); }}>
                    <i className="bi bi-chevron-left"></i>
                  </a>
                  {Array.from({ length: lastPage }, (_, i) => (
                    <a key={i} className={"pg" + (page === i + 1 ? " active" : "")} href="#" onClick={(e) => { e.preventDefault(); goPage(i + 1); }}>
                      {i + 1}
                    </a>
                  ))}
                  <a className="pg" href="#" aria-label="Next page" onClick={(e) => { e.preventDefault(); if (page < lastPage) goPage(page + 1); }}>
                    <i className="bi bi-chevron-right"></i>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
