import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AccountShell from "../components/AccountShell.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { account } from "../api/endpoints.js";
import { paginated } from "../utils/product.js";
import { dateShort, money, statusTone } from "../utils/format.js";
import { parseApiError } from "../api/errors.js";
import { useBusiness } from "../context/BusinessContext.jsx";

const STATUSES = ["All orders", "Pending", "Processing", "Confirmed", "Delivery", "Cancelled"];

export default function AccountOrders() {
  const { currencySymbol } = useBusiness();
  const [status, setStatus] = useState("All orders");
  const [message, setMessage] = useState("");

  const query = useMemo(() => ({
    per_page: 20,
    status: status === "All orders" ? undefined : status,
  }), [status]);

  const { data, loading, error, reload } = useAsync(
    (signal) => account.orders(query, { signal }),
    [JSON.stringify(query)]
  );
  const { rows, total } = paginated(data);

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order? This cannot be undone.")) return;
    try {
      await account.cancelOrder(id);
      setMessage("Your order was cancelled.");
      reload();
    } catch (e) {
      setMessage(parseApiError(e).message);
    }
  };

  return (
    <AccountShell>
      <div className="panel">
        <div className="panel-body p-4">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
            <div>
              <div className="eyebrow">History</div>
              <h2 style={{ fontSize: "var(--fs-5xl)", margin: 0 }}>All Orders</h2>
              <p className="text-mute mb-0" style={{ fontSize: "var(--fs-sm)" }}>{total} order(s) placed so far.</p>
            </div>
            <select className="form-select" style={{ maxWidth: 200 }} value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {message && <p className="mb-3" style={{ fontSize: "var(--fs-sm)" }}>{message}</p>}
          {loading && !data ? (
            <p className="text-mute mb-0">Loading orders…</p>
          ) : error ? (
            <p style={{ color: "var(--danger)" }}>{error.message}</p>
          ) : rows.length === 0 ? (
            <div className="dash-empty">
              <h4 style={{ fontSize: "var(--fs-5xl)" }}>No orders found</h4>
              <p className="text-mute mb-0">Orders matching this filter will appear here.</p>
            </div>
          ) : (
            <div className="d-grid gap-3">
              {rows.map((o) => (
                <div className="order-row" key={o.id}>
                  <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap pb-3 border-bottom">
                    <div><b>{o.invoice_no || o.unique_code}</b> <span className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>{dateShort(o.date)}</span></div>
                    <span className={`status-pill ${statusTone(o.sale_status)}`}>{o.sale_status}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap pt-3">
                    <span style={{ fontSize: "var(--fs-sm)" }}>Total <b>{money(o.total_amount, currencySymbol)}</b></span>
                    <span style={{ fontSize: "var(--fs-sm)" }}>Payment <b>{o.sale_paid_status}</b></span>
                    <div className="d-flex align-items-center gap-3">
                      <Link to={`/account/orders/${o.id}`} style={{ fontWeight: 700 }}>Details</Link>
                      <Link to={`/track-order?order=${encodeURIComponent(o.unique_code)}`} style={{ fontWeight: 700 }}>Track Order</Link>
                      {o.can_cancel && (
                        <button type="button" className="btn btn-outline-line border-0" style={{ color: "var(--danger)" }} onClick={() => cancelOrder(o.id)}>Cancel</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AccountShell>
  );
}
