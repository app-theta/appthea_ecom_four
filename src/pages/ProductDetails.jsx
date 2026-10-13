import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { money } from "../utils/format.js";
import { headlinePrice, productImages, productInStock, plain, paginated } from "../utils/product.js";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useBusiness } from "../context/BusinessContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useChat } from "../context/ChatContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { catalog, reviews as reviewsApi } from "../api/endpoints.js";
import ProductCard from "../components/ProductCard.jsx";
import Countdown from "../components/Countdown.jsx";
import Qty from "../components/Qty.jsx";
import SliderShell from "../components/SliderShell.jsx";

const FEATS = [
  ["bi-truck", "Fast Delivery", "Nationwide delivery support"],
  ["bi-receipt", "Easy Checkout", "Simple and secure ordering"],
  ["bi-briefcase", "Secure Payment", "Dynamic payment options"]
];

export default function ProductDetails() {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const cart = useCart();
  const { setCartOpen } = useUI();
  const { isAuthed } = useAuth();
  const { currencySymbol, features, shipping } = useBusiness();
  const wishlist = useWishlist();
  const chat = useChat();

  const { data: p, loading, error, reload } = useAsync((signal) => catalog.product(slug, { signal }), [slug]);

  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("rev");
  const [index, setIndex] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);

  useEffect(() => {
    setIndex(0); setQty(1);
  }, [p?.id]);

  const { data: relatedData } = useAsync(
    (signal) => (p?.category?.id ? catalog.products({ category_id: p.category.id, per_page: 6 }, { signal }) : Promise.resolve(null)),
    [p?.category?.id],
    { skip: !p?.category?.id },
  );
  const related = paginated(relatedData).rows.filter((x) => x.id !== p?.id).slice(0, 5);

  if (loading) return <div className="container-x" style={{ padding: "60px 0", textAlign: "center" }}>Loading…</div>;
  if (error || !p) {
    return (
      <div className="container-x" style={{ padding: "60px 0", textAlign: "center" }}>
        Product not found. <Link to="/shop">Back to shop</Link>
      </div>
    );
  }

  const images = productImages(p);
  const price = headlinePrice(p);
  const discount = price.was > price.now ? Math.round(((price.was - price.now) / price.was) * 100) : 0;
  const inStock = productInStock(p);
  const wished = wishlist.has(p.id);
  const reviewRows = Array.isArray(p.reviews) ? p.reviews : [];
  const reviewAvg = Number(p.average_rating || 0);
  const reviewTotal = Number(p.total_reviews ?? reviewRows.length);
  const stars = [5, 4, 3, 2, 1].map((s) => ({
    s, n: reviewRows.filter((r) => Math.round(r.rating) === s).length,
  }));

  const buy = (goToCheckout) => {
    cart.add(p, qty);
    if (goToCheckout) navigate("/checkout");
    else if (features.open_cart) setCartOpen(true);
  };

  const onWish = (e) => {
    e.preventDefault();
    if (!isAuthed) { navigate("/login"); return; }
    wishlist.toggle(p.id).catch(() => {});
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthed) { navigate("/login"); return; }
    if (!reviewRating || !reviewComment.trim()) return;
    setReviewBusy(true);
    try {
      await reviewsApi.store({ product_id: p.id, rating: reviewRating, review: reviewComment });
      setReviewComment(""); setReviewRating(0);
      reload();
    } catch { /* keep the draft on failure */ } finally { setReviewBusy(false); }
  };

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
                      {images.map((g, i) => (
                        <SwiperSlide key={i}><img src={g} alt={`${p.name} — image ${i + 1}`} /></SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </SliderShell>
                <span className="pd-counter">{index + 1} / {images.length}</span>
              </div>

              {images.length > 1 && (
                <div className="pd-thumbs">
                  {images.map((g, i) => (
                    <div
                      key={i}
                      className={"pd-thumb" + (index === i ? " active" : "")}
                      onClick={() => swiper && swiper.slideTo(i)}
                    >
                      <img src={g} alt={`thumb ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-lg-6">
              <div className="pd-info">
                <nav className="breadcrumb-x mb-0"><Link to="/">Home</Link> <span>/</span> <span>{p.name}</span></nav>
                <h1>{p.name}</h1>
                <div className="pd-rating">★★★★★ <b>{reviewAvg.toFixed(1)} ({reviewTotal} reviews)</b></div>
                {inStock ? (
                  <span className="stock-pill in" style={{ border: "1px solid rgba(23,134,74,.35)", background: "#f1fbf5" }}>In Stock</span>
                ) : (
                  <span className="stock-pill out">Out of Stock</span>
                )}

                <div className="mt-3">
                  {p.campaign ? (
                    <Link className="pd-campaign" to={`/campaign/${p.campaign.slug}`}>
                      <span className="pd-campaign__name"><i className="bi bi-lightning-charge-fill"></i> {p.campaign.title}</span>
                      <span>শেষ হবে <Countdown endsAt={p.campaign.ends_at} variant="inline" onEnd={reload} /></span>
                    </Link>
                  ) : null}
                  <div className="pd-price">{money(price.now, currencySymbol)}</div>
                  {price.was > 0 ? (
                    <p className="pd-short">
                      <span style={{ textDecoration: "line-through" }}>{money(price.was, currencySymbol)}</span> · {discount}% off
                    </p>
                  ) : null}
                  <p className="pd-short">{plain(p.short_description || p.long_description)}</p>
                </div>

                <div className="pd-buy">
                  <div className="lbl">Quantity</div>
                  <div className="mb-3"><Qty value={qty} onChange={setQty} /></div>
                  <button className="btn btn-ink w-100 mb-2" style={{ padding: 13 }} disabled={!inStock} onClick={() => buy(false)}>
                    <i className="bi bi-cart2"></i> Add to Cart
                  </button>
                  <button className="btn btn-accent w-100" style={{ padding: 13 }} disabled={!inStock} onClick={() => buy(true)}>
                    Order Now
                  </button>

                  {features.user_wishlist && (
                    <button type="button" className="btn btn-outline-line w-100 mt-2" style={{ padding: 13 }} onClick={onWish}>
                      <i className={"bi " + (wished ? "bi-heart-fill" : "bi-heart")}></i> {wished ? "In Wishlist" : "Add to Wishlist"}
                    </button>
                  )}

                  {chat.enabled && (
                    <button type="button" className="btn btn-outline-line w-100 mt-2" style={{ padding: 13 }}
                            onClick={() => chat.openChat({ product: { id: p.id, title: p.name, image: images[0] } })}>
                      <i className="bi bi-chat-dots"></i> Ask about this product
                    </button>
                  )}

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
            <button className={tab === "rev" ? "active" : ""} onClick={() => setTab("rev")}>Reviews ({reviewTotal})</button>
            <button className={tab === "ship" ? "active" : ""} onClick={() => setTab("ship")}>Shipping &amp; Delivery</button>
          </div>

          <div className={"pd-pane" + (tab === "desc" ? " active" : "")}>
            <p className="mb-0">
              {plain(p.long_description || p.short_description) || "No description available for this product yet."}
            </p>
          </div>

          <div className={"pd-pane" + (tab === "rev" ? " active" : "")}>
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="review-box">
                  <div className="review-score">{reviewAvg.toFixed(1)}</div>
                  <div className="review-stars">★★★★★</div>
                  <p className="text-mute mt-2 mb-4" style={{ fontSize: "var(--fs-md)" }}>Based on {reviewTotal} approved reviews</p>
                  {stars.map(({ s, n }) => (
                    <div className="bar-row" key={s}>
                      <span>{s} star</span>
                      <span className="review-bar"><span style={{ width: (reviewTotal ? (n / reviewTotal) * 100 : 0) + "%" }}></span></span>
                      <span>{n}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-7">
                <div className="review-box">
                  <h4 style={{ fontSize: "var(--fs-4xl)", margin: "0 0 14px" }}>Write a review</h4>
                  {isAuthed ? (
                    <form onSubmit={submitReview}>
                      <label className="form-label">Your rating</label>
                      <div className="rate-pick mb-3" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((v) => (
                          <span
                            key={v}
                            style={{ cursor: "pointer", color: (hoverRating || reviewRating) >= v ? "var(--accent)" : undefined }}
                            onMouseEnter={() => setHoverRating(v)}
                            onClick={() => setReviewRating(v)}
                          >★</span>
                        ))}
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Your review</label>
                        <textarea
                          className="form-control"
                          rows="5"
                          placeholder="Tell other customers about quality, delivery and your experience"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                        ></textarea>
                      </div>
                      <button type="submit" className="btn btn-ink w-100" style={{ padding: 13 }} disabled={reviewBusy}>
                        {reviewBusy ? "Submitting…" : "Submit for approval"}
                      </button>
                    </form>
                  ) : (
                    <p className="text-mute mb-0">
                      <Link to="/login">Log in</Link> to write a review.
                    </p>
                  )}
                </div>
              </div>

              <div className="col-12">
                {reviewRows.length === 0 ? (
                  <div className="empty-note">No approved reviews yet. Be the first customer to share an experience.</div>
                ) : (
                  <div className="d-grid gap-3">
                    {reviewRows.map((r) => (
                      <div key={r.id} className="review-box">
                        <b>{[r.customer?.first_name, r.customer?.last_name].filter(Boolean).join(" ") || r.customer_name || "Customer"}</b>
                        <div className="review-stars" style={{ fontSize: "var(--fs-md)" }}>
                          {"★".repeat(Math.round(r.rating))}{"☆".repeat(5 - Math.round(r.rating))}
                        </div>
                        <p className="mb-0 mt-2">{r.review || r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={"pd-pane" + (tab === "ship" ? " active" : "")}>
            <ul className="cat-list" style={{ maxWidth: 420 }}>
              <li><span className="row-link"><span>Inside Dhaka</span><span className="badge-n">{money(shipping.inside, currencySymbol)}</span></span></li>
              <li><span className="row-link"><span>Outside Dhaka</span><span className="badge-n">{money(shipping.outside, currencySymbol)}</span></span></li>
            </ul>
            {shipping.freeAbove > 0 && (
              <p className="text-mute mt-2 mb-0" style={{ fontSize: "var(--fs-sm)" }}>
                Free shipping on orders over {money(shipping.freeAbove, currencySymbol)}.
              </p>
            )}
          </div>
        </div>

        {related.length > 0 && (
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
        )}
      </div>
    </section>
  );
}
