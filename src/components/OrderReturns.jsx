import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { returns as returnsApi } from "../api/endpoints.js";
import { parseApiError } from "../api/errors.js";
import { useAsync } from "../hooks/useAsync.js";
import { dateShort, money } from "../utils/format.js";
import { useBusiness } from "../context/BusinessContext.jsx";

// return statuses on the pill tones the order statuses already use
export function returnTone(status) {
  if (status === "Completed") return "success";
  if (status === "Rejected") return "danger";
  if (status === "Approved") return "info";
  return "pending";
}

/** One return request - on the order page and the account's returns list. */
export function ReturnCard({ item, showOrder = false }) {
  const { currencySymbol } = useBusiness();
  return (
    <div className="order-row">
      <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap pb-3 border-bottom">
        <div>
          <b>{item.return_no}</b>
          {showOrder && item.order?.id && <> · <Link to={`/account/orders/${item.order.id}`}>{item.order.invoice_no || "Order"}</Link></>}
          <div className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>{dateShort(item.requested_at)}{item.reason ? ` · ${item.reason}` : ""}</div>
        </div>
        <span className={`status-pill ${returnTone(item.status)}`}>{item.status}</span>
      </div>
      <div className="pt-3" style={{ fontSize: "var(--fs-sm)" }}>
        {item.items.map((line) => (
          <div key={line.sale_product_id} className="d-flex justify-content-between gap-3">
            <span>{line.product}{line.combination ? ` (${line.combination})` : ""} × {line.quantity}</span>
            <span>{money(line.total, currencySymbol)}</span>
          </div>
        ))}
        <div className="d-flex gap-4 mt-2 flex-wrap">
          <span>Return value <b>{money(item.total_amount, currencySymbol)}</b></span>
          {item.refunded_amount > 0 && <span>Refunded <b>{money(item.refunded_amount, currencySymbol)}</b></span>}
        </div>
        {item.shop_note && <p className="text-mute mb-0 mt-2">Note from the shop: {item.shop_note}</p>}
      </div>
    </div>
  );
}

/**
 * Returns for one delivered order: what can still be sent back (and until when), the request
 * form, and the requests so far. The shop approves and refunds from its admin panel.
 */
export default function OrderReturns({ orderId, onChanged }) {
  const { currencySymbol } = useBusiness();
  const state = useAsync((signal) => returnsApi.forOrder(orderId, { signal }), [orderId]);
  const [open, setOpen] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [qty, setQty] = useState({});
  const [reasonId, setReasonId] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState("");

  // arriving from the returns page (…/orders/5#returns): bring the section into view
  useEffect(() => {
    if (state.data && window.location.hash === "#returns") document.getElementById("returns")?.scrollIntoView({ behavior: "smooth" });
  }, [state.data]);

  if (state.loading && !state.data) return <p className="text-mute">Loading returns…</p>;
  if (state.error) return null;

  const info = state.data || {};
  const items = (info.returnable_items || []).filter((line) => line.returnable_quantity > 0);
  const history = info.returns || [];
  const value = items.reduce((sum, line) => sum + (qty[line.sale_product_id] || 0) * line.unit_price, 0);

  const start = async () => {
    setOpen(true);
    setSent("");
    if (!reasons.length) {
      try { setReasons(await returnsApi.reasons()); } catch (e) { setError(parseApiError(e).message); }
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const chosen = items
      .filter((line) => (qty[line.sale_product_id] || 0) > 0)
      .map((line) => ({ sale_product_id: line.sale_product_id, quantity: qty[line.sale_product_id] }));
    if (!chosen.length) {
      setError("Choose at least one item to return.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const res = await returnsApi.request(orderId, { items: chosen, sale_return_reason_id: Number(reasonId), note });
      setSent(`Your return request ${res?.return_no || ""} was sent. The shop will contact you.`);
      setOpen(false);
      setQty({});
      setReasonId("");
      setNote("");
      state.reload();
      onChanged?.();
    } catch (err) {
      setError(parseApiError(err).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel mt-4" id="returns">
      <div className="panel-head"><h5>Returns</h5></div>
      <div className="panel-body">
        {sent && <p className="mb-3" style={{ color: "var(--success, #1a7f37)" }}>{sent}</p>}
        {info.can_return ? (
          !open && (
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <button type="button" className="btn btn-outline-line" onClick={start}>Request a return</button>
              {info.return_deadline && <span className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>Returns accepted until {dateShort(info.return_deadline)}</span>}
            </div>
          )
        ) : (
          info.not_returnable_reason && <p className="text-mute mb-0">{info.not_returnable_reason}</p>
        )}

        {open && (
          <form onSubmit={submit}>
            <label className="form-label">Choose what you are sending back</label>
            {items.map((line) => (
              <div key={line.sale_product_id} className="d-flex align-items-center justify-content-between gap-3 py-2 border-bottom">
                <div>
                  <b>{line.product}</b>
                  <div className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>
                    {line.combination ? `${line.combination} · ` : ""}{money(line.unit_price, currencySymbol)} · up to {line.returnable_quantity} of {line.quantity}
                  </div>
                </div>
                <select
                  className="form-select return-qty"
                  style={{ maxWidth: 90 }}
                  aria-label={`Quantity to return of ${line.product}`}
                  value={qty[line.sale_product_id] || 0}
                  onChange={(e) => setQty({ ...qty, [line.sale_product_id]: Number(e.target.value) })}
                >
                  {Array.from({ length: Math.floor(line.returnable_quantity) + 1 }, (_, n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            ))}
            <div className="mt-3">
              <label className="form-label" htmlFor="return-reason">Reason</label>
              <select className="form-select" id="return-reason" required value={reasonId} onChange={(e) => setReasonId(e.target.value)}>
                <option value="">Choose a reason</option>
                {reasons.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div className="mt-3">
              <label className="form-label" htmlFor="return-note">Anything the shop should know? (optional)</label>
              <textarea className="form-control" id="return-note" rows={3} maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            {error && <p className="mt-3 mb-0" style={{ color: "var(--danger)", fontSize: "var(--fs-sm)" }}>{error}</p>}
            <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mt-3">
              <span>Return value <b className="return-value">{money(value, currencySymbol)}</b></span>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-line" onClick={() => setOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-accent" disabled={busy}>{busy ? "Sending…" : "Send return request"}</button>
              </div>
            </div>
          </form>
        )}

        {history.length > 0 && (
          <div className="d-grid gap-3 mt-4">
            <div className="eyebrow">Your return requests</div>
            {history.map((r) => <ReturnCard key={r.id} item={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}
