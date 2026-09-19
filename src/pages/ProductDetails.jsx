import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { PRODUCTS, findProduct, money, discount } from "../data/site.js";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Qty from "../components/Qty.jsx";
import SliderShell from "../components/SliderShell.jsx";

const FEATS = [
  ["bi-truck", "Fast Delivery", "Nationwide delivery support"],
  ["bi-receipt", "Easy Checkout", "Simple and secure ordering"],
  ["bi-briefcase", "Secure Payment", "Dynamic payment options"]
];

export default function ProductDetails() {
  const { id } = useParams();
  const p = findProduct(id) || PRODUCTS[1];
  const cart = useCart();
  const { setCartOpen } = useUI();

  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("rev");
  const [index, setIndex] = useState(0);
  const [swiper, setSwiper] = useState(null);

  const related = PRODUCTS.filter((x) => x.id !== p.id).slice(0, 5);

  return (
    <section className="section">
      <div className="container-x">
        <div className="pd-wrap">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="pd-gallery">
                <SliderShell>
                  {({ prev, next }) => (
                    <Swiper
                      className="pd-main"
                      modules={[Navigation]}
                      onSwiper={setSwiper}
                      onSlideChange={(s) => setIndex(s.activeIndex)}
                      onBeforeInit={(s) => { s.params.navigation.prevEl = prev.current; s.params.navigation.nextEl = next.current; }}
                      navigation
                    >
                      {p.gallery.map((g, i) => (
                        <SwiperSlide key={i}><img src={g} alt={`${p.name} — image ${i + 1}`} /></SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </SliderShell>
                <span className="pd-counter">{index + 1} / {p.gallery.length}</span>
              </div>

              <div className="pd-thumbs">
                {p.gallery.map((g, i) => (
                  <div
                    key={i}
                    className={"pd-thumb" + (index === i ? " active" : "")}
                    onClick={() => swiper && swiper.slideTo(i)}
                  >
                    <img src={g} alt={`thumb ${i + 1}`} />
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-6">
              <div className="pd-info">
                <nav className="breadcrumb-x mb-0"><Link to="/">Home</Link> <span>/</span> <span>{p.name}</span></nav>
                <h1>{p.name}</h1>
                <div className="pd-rating">★★★★★ <b>0.0 (0 reviews)</b></div>
                {p.stock ? (
                  <span className="stock-pill in" style={{ border: "1px solid rgba(23,134,74,.35)", background: "#f1fbf5" }}>In Stock</span>
                ) : (
                  <span className="stock-pill out">Out of Stock</span>
                )}

                <div className="mt-3">
                  <div className="pd-price">{money(p.price)}</div>
                  {p.old ? (
                    <p className="pd-short">
                      <span style={{ textDecoration: "line-through" }}>{money(p.old)}</span> · {discount(p)}% off
                    </p>
                  ) : null}
                  <p className="pd-short">{p.desc}</p>
                </div>

                <div className="pd-buy">
                  <div className="lbl">Quantity</div>
                  <div className="mb-3"><Qty value={qty} onChange={setQty} /></div>
                  <button
                    className="btn btn-ink w-100 mb-2"
                    style={{ padding: 13 }}
                    onClick={() => { cart.add(p.id, qty); setCartOpen(true); }}
                  >
                    <i className="bi bi-cart2"></i> Add to Cart
                  </button>
                  <Link
                    className="btn btn-accent w-100"
                    style={{ padding: 13 }}
                    to="/checkout"
                    onClick={() => cart.add(p.id, qty)}
                  >
                    Order Now
                  </Link>

                  <div className="pd-feats">
                    {FEATS.map(([ico, t, s]) => (
                      <div className="pd-feat" key={t}>
                        <div className="ico"><i className={"bi " + ico}></i></div>
                        <h6>{t}</h6><p>{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel mt-4">
          <div className="panel-body p-4 pb-3">
            <div className="eyebrow">Product information</div>
            <h2 style={{ fontSize: "var(--fs-7xl)", margin: 0 }}>Everything you need to know</h2>
          </div>

          <div className="pd-tabs">
            <button className={tab === "desc" ? "active" : ""} onClick={() => setTab("desc")}>Description</button>
            <button className={tab === "rev" ? "active" : ""} onClick={() => setTab("rev")}>Reviews (0)</button>
            <button className={tab === "ship" ? "active" : ""} onClick={() => setTab("ship")}>Shipping &amp; Delivery</button>
          </div>

          <div className={"pd-pane" + (tab === "desc" ? " active" : "")}>
            <p className="mb-0">
              {p.desc}. এই পণ্যের বিস্তারিত বিবরণ এখানে থাকবে — উপাদান, সাইজ, ওয়ারেন্টি এবং ব্যবহারের নির্দেশনা।
            </p>
          </div>

          <div className={"pd-pane" + (tab === "rev" ? " active" : "")}>
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="review-box">
                  <div className="review-score">0.0</div>
                  <div className="review-stars">★★★★★</div>
                  <p className="text-mute mt-2 mb-4" style={{ fontSize: "var(--fs-md)" }}>Based on 0 approved reviews</p>
                  {[5, 4, 3, 2, 1].map((s) => (
                    <div className="bar-row" key={s}>
                      <span>{s} star</span>
                      <span className="review-bar"><span style={{ width: "0%" }}></span></span>
                      <span>0</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-7">
                <div className="review-box">
                  <h4 style={{ fontSize: "var(--fs-4xl)", margin: "0 0 14px" }}>Write a review</h4>
                  <label className="form-label">Your rating</label>
                  <div className="rate-pick mb-3">★★★★★</div>
                  <div className="mb-3">
                    <label className="form-label">Review title</label>
                    <input className="form-control" placeholder="Summarize your experience" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Your review</label>
                    <textarea className="form-control" rows="5" placeholder="Tell other customers about quality, delivery and your experience"></textarea>
                  </div>
                  <button className="btn btn-ink w-100" style={{ padding: 13 }}>Submit for approval</button>
                </div>
              </div>

              <div className="col-12">
                <div className="empty-note">No approved reviews yet. Be the first customer to share an experience.</div>
              </div>
            </div>
          </div>

          <div className={"pd-pane" + (tab === "ship" ? " active" : "")}>
            <div className="empty-note" style={{ maxWidth: 620 }}>
              No active delivery method is configured. Add one from the admin shipping settings.
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="sec-bar">
            <div>
              <div className="eyebrow">You may also like</div>
              <h2>Related Products</h2>
            </div>
            <Link className="btn btn-outline-line" to="/shop">View all</Link>
          </div>
          <div className="grid-products">
            {related.map((r) => <ProductCard key={r.id} product={r} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
