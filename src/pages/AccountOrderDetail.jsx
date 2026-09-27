import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import AccountShell from "../components/AccountShell.jsx";
import OrderReturns from "../components/OrderReturns.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { account } from "../api/endpoints.js";
import { parseApiError } from "../api/errors.js";
import { dateShort, money, statusTone } from "../utils/format.js";
import { imageUrl, num } from "../utils/product.js";
import { useBusiness } from "../context/BusinessContext.jsx";

export default function AccountOrderDetail() {
  const { id } = useParams();
  const { currencySymbol } = useBusiness();
  const { data, loading, error, reload } = useAsync((signal) => account.orderDetails(id, { signal }), [id]);
  const [message, setMessage] = useState("");

  const o = data?.order;
  const row = (label, value, strong = false) => (
    <div className="d-flex justify-content-between py-1" style={{ fontSize: strong ? "var(--fs-lg)" : "var(--fs-sm)" }}>
      <span>{label}</span>{strong ? <b>{value}</b> : <span>{value}</span>}
    </div>
  );

  const download = async () => {
    try {
      const res = await account.orderDownload(o.id);
      if (res?.download_url) window.open(res.download_url, "_blank");
    } catch (e) { setMessage(parseApiError(e).message); }
  };

  const cancel = async () => {
    if (!window.confirm("Cancel this order? This cannot be undone.")) return;
    try {
      await account.cancelOrder(o.id);
      setMessage("Your order was cancelled.");
      reload();
    } catch (e) { setMessage(parseApiError(e).message); }
  };

  return (
    <AccountShell>
      {loading && !data ? (
        <p className="text-mute">Loading order…</p>
      ) : error || !o ? (
        <div className="dash-empty">
          <p className="mb-2">{error?.message || "Order not found."}</p>
          <Link to="/account/orders">Back to orders</Link>
        </div>
      ) : (
        <>
          <div className="panel">
            <div className="panel-body p-4">
              <Link to="/account/orders" className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>← All orders</Link>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mt-2">
                <div>
                  <div className="eyebrow">Order</div>
                  <h2 style={{ fontSize: "var(--fs-5xl)", margin: 0 }}>{o.invoice_no}</h2>
                  <p className="text-mute mb-0" style={{ fontSize: "var(--fs-sm)" }}>Placed on {dateShort(o.date)}</p>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className={`status-pill ${statusTone(o.sale_status)}`}>{o.sale_status}</span>
                  <span className={`status-pill ${o.sale_paid_status === "Paid" ? "success" : "pending"}`}>{o.sale_paid_status}</span>
                  <button type="button" className="btn btn-outline-line" onClick={download}><i className="bi bi-download me-1"></i> Invoice</button>
                  {o.can_cancel && (
                    <button type="button" className="btn btn-outline-line" style={{ color: "var(--danger)" }} onClick={cancel}>Cancel order</button>
                  )}
                </div>
              </div>
              {message && <p className="mt-3 mb-0" style={{ fontSize: "var(--fs-sm)" }}>{message}</p>}
            </div>
          </div>

          <div className="row g-4 mt-1">
            <div className="col-lg-7">
              <div className="panel h-100">
                <div className="panel-head"><h5>Items</h5></div>
                <div className="panel-body">
                  {(o.products || []).map((it) => (
                    <div key={it.id} className="d-flex align-items-center gap-3 py-2 border-bottom">
                      {imageUrl(it.product?.thumbnail) ? (
                        <img src={imageUrl(it.product?.thumbnail)} alt="" width="56" height="70" style={{ objectFit: "cover", borderRadius: 8 }} />
                      ) : <span style={{ width: 56, height: 70, borderRadius: 8, background: "var(--line)" }} />}
                      <div className="flex-grow-1">
                        <b>{it.product?.name}</b>
                        <div className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>
                          {it.barcode?.combination ? `${it.barcode.combination} · ` : ""}{money(it.selling_price, currencySymbol)} × {num(it.quantity)}
                        </div>
                      </div>
                      <b>{money(it.subtotal_price, currencySymbol)}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="panel h-100">
                <div className="panel-head"><h5>Summary</h5></div>
                <div className="panel-body">
                  {row("Subtotal", money(o.sub_total, currencySymbol))}
                  {row("Shipping", money(o.shipping_charge, currencySymbol))}
                  {num(o.discount_amount) > 0 && row("Discount", "− " + money(o.discount_amount, currencySymbol))}
                  {num(o.discount_coupon_amount) > 0 && row("Coupon", "− " + money(o.discount_coupon_amount, currencySymbol))}
                  {row("Total", money(o.total_amount, currencySymbol), true)}
                  {num(o.returned_amount) > 0 && row("Returned", "− " + money(o.returned_amount, currencySymbol))}
                  {row("Paid", money(o.paid_amount, currencySymbol))}
                  {num(o.due_amount) > 0 && row("Due", money(o.due_amount, currencySymbol))}
                  <hr />
                  <div className="eyebrow">Delivery</div>
                  <p className="mb-1"><b>{o.shipping_address?.name}</b></p>
                  <p className="text-mute mb-1" style={{ fontSize: "var(--fs-sm)" }}>{o.shipping_address?.phone}</p>
                  <p className="text-mute mb-2" style={{ fontSize: "var(--fs-sm)" }}>
                    {[o.shipping_address?.address, o.shipping_address?.city, o.shipping_address?.zip_code].filter(Boolean).join(", ")}
                  </p>
                  {o.payment_type && <p className="mb-0" style={{ fontSize: "var(--fs-sm)" }}>Payment: <b>{o.payment_type}</b></p>}
                </div>
              </div>
            </div>
          </div>

          {(o.can_request_return || num(o.returned_amount) > 0) && <OrderReturns orderId={o.id} onChanged={reload} />}

          {(o.status_activities || []).length > 0 && (
            <div className="panel mt-4">
              <div className="panel-head"><h5>Order progress</h5></div>
              <div className="panel-body">
                {o.status_activities.map((a, i) => (
                  <div key={i} className="d-flex gap-3 py-2 border-bottom" style={{ fontSize: "var(--fs-sm)" }}>
                    <span className={`status-pill ${statusTone(a.status)}`} style={{ minWidth: 90, textAlign: "center" }}>{a.status}</span>
                    <span className="text-mute">{dateShort(a.date_time)}{a.note ? ` · ${a.note}` : ""}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </AccountShell>
  );
}
