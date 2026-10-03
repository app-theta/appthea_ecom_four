import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { money } from "../utils/format.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useBusiness } from "../context/BusinessContext.jsx";
import { checkout as checkoutApi } from "../api/endpoints.js";
import { parseApiError, isPriceMismatch, needsOtp } from "../api/errors.js";
import { useCheckoutDraftAutosave, storedGuestId } from "../hooks/useCheckoutDraftAutosave.js";
import CartLine from "../components/CartLine.jsx";
import OtpModal from "../components/OtpModal.jsx";

const DISTRICTS = ["Dhaka", "Chattogram", "Sirajganj", "Rajshahi", "Khulna", "Sylhet"];

export default function Checkout() {
  const navigate = useNavigate();
  const cart = useCart();
  const { shipping, enabledPayments, features, currencySymbol } = useBusiness();
  const { customer, isAuthed } = useAuth();

  const [area, setArea] = useState("inside_city");
  const [payment, setPayment] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", district: "", thana: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpDone, setOtpDone] = useState(false);
  const renderedAt = useRef(Math.floor(Date.now() / 1000));
  const honeypot = useRef("");

  useEffect(() => {
    if (!payment && enabledPayments.length) setPayment(enabledPayments[0]);
  }, [enabledPayments, payment]);

  useEffect(() => {
    if (!isAuthed || !customer) return;
    setForm((f) => ({
      ...f,
      name: f.name || [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.name || "",
      email: f.email || customer.email || "",
      phone: f.phone || customer.phone || "",
      address: f.address || customer.address || "",
    }));
  }, [isAuthed, customer]);

  const shippingCharge = useMemo(() => {
    if (shipping.freeAbove > 0 && cart.subtotal >= shipping.freeAbove) return 0;
    return area === "inside_city" ? shipping.inside : shipping.outside;
  }, [area, shipping, cart.subtotal]);

  const discount = Number(applied?.discount_amount ?? 0);
  const grandTotal = useMemo(() => {
    if (applied?.grand_total != null) return Number(applied.grand_total);
    return Math.max(0, cart.subtotal + shippingCharge - discount);
  }, [applied, cart.subtotal, shippingCharge, discount]);

  const fullAddress = useMemo(
    () => [form.address, form.thana].filter(Boolean).join(", "),
    [form.address, form.thana]
  );

  const getCartPayload = useCallback(() => ({ cart: cart.apiCart(), grandTotal }), [cart, grandTotal]);
  const { saveDraft, cancelPendingDraft } = useCheckoutDraftAutosave({ isLoggedIn: isAuthed, enabled: !!features.draft_orders, getCartPayload });

  const set = (k) => (e) => {
    const value = e.target.value;
    const next = { ...form, [k]: value };
    setForm(next);
    if (k === "phone") {
      saveDraft({
        full_name: next.name,
        phone: next.phone,
        email: next.email,
        address: [next.address, next.thana].filter(Boolean).join(", "),
        city: next.district,
        country: "Bangladesh",
      });
    }
  };

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponBusy(true); setCouponError("");
    try {
      const data = await checkoutApi.applyCoupon({
        coupon_code: coupon.trim(),
        cart: cart.apiCart(),
        shipping_area: area,
      });
      setApplied(data);
    } catch (e) {
      setApplied(null);
      setCouponError(parseApiError(e).message);
    } finally { setCouponBusy(false); }
  };

  const removeCoupon = () => { setApplied(null); setCoupon(""); setCouponError(""); };

  const placeOrder = async (e) => {
    e?.preventDefault();
    setErrors({}); setBanner(null);

    if (!cart.detailed.length) return;
    if (!form.phone || !form.name || !fullAddress) {
      setBanner({ kind: "error", text: "Please fill in your name, phone and address." });
      return;
    }
    if (!payment) {
      setBanner({ kind: "error", text: "Please select a payment method." });
      return;
    }

    setPlacing(true);
    try {
      const { changed } = await cart.syncPrices();
      if (changed) {
        setBanner({ kind: "info", text: "Prices were updated — please review your order before continuing." });
        setPlacing(false);
        return;
      }

      // placing it now: a draft save still waiting must not run after the order
      cancelPendingDraft();

      const payload = {
        cart: cart.apiCart(),
        // lets the server drop this browser's checkout draft once the order exists
        guest_id: storedGuestId(),
        coupon_code: applied ? coupon.trim() : "",
        coupon_discount_amount: discount,
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        address: fullAddress,
        city: form.district,
        country: "Bangladesh",
        order_note: form.notes,
        shipping_area: area,
        payment_type: payment,
        grand_total: grandTotal,
        website: honeypot.current,
        form_rendered_at: renderedAt.current,
      };

      const res = await checkoutApi.place(payload);
      if (res?.status === false) throw { response: { data: res, status: res.code } };

      const data = res?.data || {};
      const code = data.order?.unique_code || data.order?.order_code || "";

      if (data.payment_required && data.payment_url) {
        setBanner({ kind: "info", text: "Redirecting to payment…" });
        window.location.href = data.payment_url;
        return;
      }

      cart.clear();
      navigate(`/order/success?order=${encodeURIComponent(code)}&message=${encodeURIComponent(res?.message || "")}`);
    } catch (err) {
      const parsed = parseApiError(err);
      setErrors(parsed.fields);

      if (needsOtp(parsed) && payment === "Cash On Delivery" && !otpDone) {
        try { await checkoutApi.sendOtp(form.phone); } catch { /* modal has its own resend */ }
        setOtpOpen(true);
      } else if (isPriceMismatch(parsed)) {
        await cart.syncPrices();
        setBanner({ kind: "error", text: "A price changed — please review your order and try again." });
      } else {
        setBanner({ kind: "error", text: parsed.message });
      }
    } finally { setPlacing(false); }
  };

  if (!cart.detailed.length) {
    return (
      <section className="section">
        <div className="container-x">
          <div className="empty-state">
            <div className="ico"><i className="bi bi-cart2"></i></div>
            <h5>Your cart is empty</h5>
            <p>Add products before checking out.</p>
            <Link className="btn btn-accent" to="/shop">Start Shopping</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-x">
        {banner && (
          <div className="alert-x mb-4" role="alert">{banner.text}</div>
        )}

        <form className="row g-4" onSubmit={placeOrder} noValidate>
          <div className="col-lg-8">
            <div className="panel mb-4">
              <div className="panel-body p-4">
                <div className="eyebrow">Delivery details</div>
                <h2 style={{ fontSize: "var(--fs-7xl)", marginBottom: 22 }}>Customer Details</h2>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name <span className="req">*</span></label>
                    <input className="form-control" value={form.name} onChange={set("name")} required />
                    {errors.full_name && <div className="invalid-feedback d-block">{errors.full_name}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number <span className="req">*</span></label>
                    <input className="form-control" type="tel" value={form.phone} onChange={set("phone")} required />
                    {errors.phone && <div className="invalid-feedback d-block">{errors.phone}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Full Address <span className="req">*</span></label>
                    <textarea className="form-control" rows="4" value={form.address} onChange={set("address")} required></textarea>
                    {errors.address && <div className="invalid-feedback d-block">{errors.address}</div>}
                  </div>
                  <div className="col-12">
                    <label className="form-label">Email Address <span className="opt">Optional</span></label>
                    <input type="email" className="form-control" value={form.email} onChange={set("email")} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">District <span className="opt">Optional</span></label>
                    <select className="form-select" value={form.district} onChange={set("district")}>
                      <option value="">Select district</option>
                      {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Area / Thana / Upazila <span className="opt">Optional</span></label>
                    <input className="form-control" placeholder="e.g. Mirpur" value={form.thana} onChange={set("thana")} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Order Note <span className="opt">Optional</span></label>
                    <textarea className="form-control" rows="3" value={form.notes} onChange={set("notes")}></textarea>
                  </div>
                </div>

                <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" onChange={(e) => { honeypot.current = e.target.value; }} />
                </div>
              </div>
            </div>

            <div className="panel mb-4">
              <div className="panel-body p-4">
                <div className="eyebrow">Delivery method</div>
                <h2 style={{ fontSize: "var(--fs-7xl)", marginBottom: 20 }}>Choose Shipping</h2>
                <div className="row g-3">
                  {[
                    { id: "inside_city", label: "Inside Dhaka", note: "Delivery in 24-48 hours", price: shipping.inside },
                    { id: "outside_city", label: "Outside Dhaka", note: "Delivery in 2-4 business days", price: shipping.outside },
                  ].map((s) => (
                    <div className="col-md-6" key={s.id}>
                      <label className={"option-card" + (area === s.id ? "" : " plain")}>
                        <input
                          className="form-check-input mt-1"
                          type="radio"
                          name="ship"
                          checked={area === s.id}
                          onChange={() => setArea(s.id)}
                        />
                        <span>
                          <h6>{s.label}</h6>
                          <p>{s.note}</p>
                          <span className="price">
                            {shipping.freeAbove > 0 && cart.subtotal >= shipping.freeAbove ? "Free" : money(s.price, currencySymbol)}
                          </span>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {enabledPayments.length > 0 && (
              <div className="panel">
                <div className="panel-body p-4">
                  <div className="eyebrow">Payment</div>
                  <h2 style={{ fontSize: "var(--fs-7xl)", marginBottom: 20 }}>Choose Payment Method</h2>
                  <div className="row g-3">
                    {enabledPayments.map((type) => (
                      <div className="col-md-6" key={type}>
                        <label className={"option-card" + (payment === type ? "" : " plain")}>
                          <input
                            className="form-check-input mt-1"
                            type="radio"
                            name="pay"
                            checked={payment === type}
                            onChange={() => setPayment(type)}
                          />
                          <span>
                            <h6>{type}</h6>
                            <p>{type === "Cash On Delivery" ? "Pay the courier when your order is delivered." : "Pay securely online."}</p>
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="panel">
              <div className="panel-head">
                <h5>Order Summary</h5>
                <span className="muted-pill">{cart.count} item(s)</span>
              </div>
              <div className="panel-body pt-0">
                {cart.detailed.map((p) => <CartLine key={p.id} item={p} />)}
              </div>

              {features.is_coupon && (
                <div className="panel-body border-top">
                  <label className="form-label">Coupon Code</label>
                  {applied ? (
                    <div className="d-flex align-items-center justify-content-between">
                      <span style={{ fontWeight: 700 }}>{coupon.toUpperCase()}</span>
                      <button type="button" className="btn btn-outline-line border-0" onClick={removeCoupon}>Remove</button>
                    </div>
                  ) : (
                    <div className="d-flex gap-2">
                      <input className="form-control" placeholder="Enter coupon" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                      <button type="button" className="btn btn-ink" onClick={applyCoupon} disabled={couponBusy}>
                        {couponBusy ? "…" : "Apply"}
                      </button>
                    </div>
                  )}
                  {couponError && <p className="mb-0 mt-2" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{couponError}</p>}
                </div>
              )}

              <div className="panel-body border-top">
                <div className="sum-row"><span className="label">Subtotal</span><b>{money(applied?.sub_total ?? cart.subtotal, currencySymbol)}</b></div>
                <div className="sum-row"><span className="label">Shipping</span><b>{money(applied?.shipping_charge ?? shippingCharge, currencySymbol)}</b></div>
                {discount > 0 && (
                  <div className="sum-row"><span className="label" style={{ color: "var(--success)" }}>Discount</span><b>-{money(discount, currencySymbol)}</b></div>
                )}
                <div className="sum-total mb-3"><span className="t">Total</span><span className="v">{money(grandTotal, currencySymbol)}</span></div>
                <button className="btn btn-accent w-100" style={{ padding: 14, fontSize: "var(--fs-lg)" }} disabled={placing}>
                  {placing ? "Placing order…" : "Place Order"}
                </button>
                <div className="note-box mt-3">Your checkout data is validated and protected.</div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <OtpModal
        open={otpOpen}
        phone={form.phone}
        onClose={() => setOtpOpen(false)}
        onVerified={() => { setOtpOpen(false); setOtpDone(true); placeOrder(); }}
      />
    </section>
  );
}
