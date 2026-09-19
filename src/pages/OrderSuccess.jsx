import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { money } from "../utils/format.js";
import { imageUrl, num } from "../utils/product.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useBusiness } from "../context/BusinessContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { checkout as checkoutApi } from "../api/endpoints.js";

/** Landing page for both COD success and gateway return: /order/success?order=CODE&message=… */
export default function OrderSuccess() {
  const [params, setParams] = useSearchParams();
  const cart = useCart();
  const { isAuthed } = useAuth();
  const { currencySymbol } = useBusiness();
  const code = params.get("order") || "";
  const [message] = useState(() => params.get("message") || "");
  const [copied, setCopied] = useState(false);

  const { data: orderData, loading: orderLoading } = useAsync(
    () => checkoutApi.trackOrder(code),
    [code],
    { skip: !code }
  );
  const order = orderData?.order || null;
  const orderItems = Array.isArray(order?.products) ? order.products : [];
  const address = order?.shipping_address || {};

  useEffect(() => { if (cart.detailed.length) cart.clear(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (params.get("message")) setParams(code ? { order: code } : {}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard unavailable */ }
  };

  return (
    <section className="section">
      <div className="container-x">
        {message && <div className="alert-x mb-4">{message}</div>}

        <div className="panel">
          <div className="success-top">
            <div className="success-ico"><i className="bi bi-check2"></i></div>
            <h1>Order placed successfully!</h1>
            <p>Thank you — we have received your order and will contact you shortly.</p>
            <div className="meta-grid">
              {code && (
                <button type="button" className="meta-card" style={{ border: 0, cursor: "pointer", minWidth: 220 }} onClick={copyCode} title="Click to copy">
                  <div className="k">Order Number {copied && "· Copied!"}</div>
                  <div className="v" style={{ wordBreak: "break-all" }}>{code}</div>
                </button>
              )}
              {order?.date && (
                <div className="meta-card"><div className="k">Order Date</div><div className="v ink">{order.date}</div></div>
              )}
              {order && (
                <div className="meta-card"><div className="k">Total</div><div className="v ink">{money(order.total_amount, currencySymbol)}</div></div>
              )}
              {order?.payment_type && (
                <div className="meta-card"><div className="k">Payment</div><div className="v ink">{order.payment_type}</div></div>
              )}
            </div>
          </div>

          <div className="panel-body p-4">
            {orderLoading ? (
              <p className="text-center text-mute mb-0">Loading order details…</p>
            ) : order ? (
              <div className="row g-4">
                <div className="col-lg-8">
                  <div className="panel">
                    <div className="panel-head">
                      <h5>Order Items</h5>
                      <span className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>{orderItems.length} item(s)</span>
                    </div>
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
                              <span><b>Quantity:</b> {it.quantity}</span><span>{money(it.selling_price, currencySymbol)} each</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="panel mb-4">
                    <div className="panel-head"><h5>Payment Summary</h5></div>
                    <div className="panel-body">
                      <div className="sum-row"><span className="label">Subtotal</span><b>{money(order.sub_total, currencySymbol)}</b></div>
                      <div className="sum-row"><span className="label">Shipping</span><b>{money(order.shipping_charge, currencySymbol)}</b></div>
                      {num(order.discount_amount) > 0 && (
                        <div className="sum-row"><span className="label" style={{ color: "var(--success)" }}>Discount</span><b>-{money(order.discount_amount, currencySymbol)}</b></div>
                      )}
                      <div className="sum-total"><span className="t">Total</span><span className="v">{money(order.total_amount, currencySymbol)}</span></div>
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel-head"><h5>Delivery Information</h5></div>
                    <div className="panel-body info-block">
                      <div className="k">Customer</div><div className="v">{address.name}</div>
                      <div className="k">Phone</div><div className="v">{address.phone}</div>
                      <div className="k">Address</div>
                      <div className="v">{[address.address, address.city, address.zip_code, address.country].filter(Boolean).join(", ")}</div>
                      <div className="k">Status</div>
                      <div><span className={"status-pill" + (order.sale_status === "Pending" ? " pending" : "")}>{order.sale_status}</span></div>
                    </div>
                  </div>

                  <div className="note-box mt-4">Keep your order number for future tracking.</div>
                </div>
              </div>
            ) : (
              <p className="text-center text-mute mb-0">Order details are not available right now.</p>
            )}

            <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap mt-4">
              <Link to="/shop" style={{ color: "var(--ink-soft)", fontWeight: 600 }}>Continue Shopping</Link>
              {isAuthed ? (
                <Link className="btn btn-outline-line" to="/account/orders">View My Orders</Link>
              ) : (
                <Link className="btn btn-outline-line" to="/track-order">Track Order</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
