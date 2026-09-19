import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { money } from "../utils/format.js";
import { imageUrl } from "../utils/product.js";
import { useBusiness } from "../context/BusinessContext.jsx";
import { checkout as checkoutApi } from "../api/endpoints.js";
import { parseApiError } from "../api/errors.js";

export default function TrackOrder() {
  const [params] = useSearchParams();
  const { currencySymbol } = useBusiness();
  const [code, setCode] = useState(params.get("order") || "");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true); setError(""); setOrder(null);
    try {
      const data = await checkoutApi.trackOrder(code.trim());
      if (!data?.order) throw new Error("Order not found. Please check your order number.");
      setOrder(data.order);
    } catch (err) {
      setError(parseApiError(err, "Order not found. Please check your order number.").message);
    } finally { setBusy(false); }
  };

  const orderItems = Array.isArray(order?.products) ? order.products : [];
  const address = order?.shipping_address || {};

  return (
    <section className="section">
      <div className="container-x">
        <nav className="breadcrumb-x text-center"><Link to="/">Home</Link> <span>/</span> <span>Track Order</span></nav>
        <div className="section-head">
          <div className="eyebrow">Delivery status</div>
          <h1 className="page-title">Track Your Order</h1>
          <p>Enter the order number used during checkout.</p>
        </div>

        <div className="panel mx-auto" style={{ maxWidth: 760 }}>
          <div className="panel-body p-4">
            <form className="row g-3 align-items-end" onSubmit={submit}>
              <div className="col-md-5">
                <label className="form-label">Order Number</label>
                <input className="form-control" placeholder="Example: 1024" value={code} onChange={(e) => setCode(e.target.value)} required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Phone Number <span className="opt">Optional</span></label>
                <input className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="col-md-3">
                <button className="btn btn-accent w-100" style={{ padding: 12 }} disabled={busy}>
                  {busy ? "Searching…" : "Track Order"}
                </button>
              </div>
            </form>
            {error && <div className="alert-x mt-4">{error}</div>}
            {!order && !error && <div className="note-box mt-4">The order number is the one you received after checkout.</div>}
          </div>
        </div>

        {order && (
          <div className="panel mx-auto mt-4" style={{ maxWidth: 900 }}>
            <div className="success-top" style={{ paddingTop: 28 }}>
              <div className="meta-grid">
                <div className="meta-card"><div className="k">Order Number</div><div className="v">{order.unique_code}</div></div>
                <div className="meta-card"><div className="k">Order Date</div><div className="v ink">{order.date}</div></div>
                <div className="meta-card"><div className="k">Total</div><div className="v ink">{money(order.total_amount, currencySymbol)}</div></div>
                <div className="meta-card"><div className="k">Status</div><div className="v ink">{order.sale_status}</div></div>
              </div>
            </div>
            <div className="panel-body p-4">
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="panel">
                    <div className="panel-head"><h5>Order Items</h5></div>
                    <div className="panel-body d-grid gap-3">
                      {orderItems.map((it) => (
                        <div className="order-item" key={it.id}>
                          <div className="thumb"><img src={imageUrl(it.product?.thumbnail) || ""} alt={it.product?.name || ""} /></div>
                          <div>
                            <div className="d-flex justify-content-between gap-3">
                              <b style={{ fontSize: "var(--fs-sm)" }}>{it.product?.name}</b>
                              <b style={{ color: "var(--accent)" }}>{money(it.subtotal_price, currencySymbol)}</b>
                            </div>
                            <div className="d-flex justify-content-between gap-3 mt-2" style={{ fontSize: "var(--fs-2xs)", color: "var(--ink-soft)" }}>
                              <span><b>Quantity:</b> {it.quantity}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="panel">
                    <div className="panel-head"><h5>Delivery Information</h5></div>
                    <div className="panel-body info-block">
                      <div className="k">Customer</div><div className="v">{address.name}</div>
                      <div className="k">Phone</div><div className="v">{address.phone}</div>
                      <div className="k">Address</div>
                      <div className="v">{[address.address, address.city, address.zip_code, address.country].filter(Boolean).join(", ")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
