import { Link } from "react-router-dom";
import AccountShell from "../components/AccountShell.jsx";
import { ReturnCard } from "../components/OrderReturns.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { account, returns as returnsApi } from "../api/endpoints.js";
import { paginated } from "../utils/product.js";
import { dateShort } from "../utils/format.js";

/**
 * Returns & refunds: every return request the customer made, and the delivered orders they can
 * still ask a return for (the request itself is made on the order's page, item by item).
 */
export default function AccountReturns() {
  const mine = useAsync((signal) => returnsApi.mine({ per_page: 50 }, { signal }), []);
  const delivered = useAsync((signal) => account.orders({ status: "Delivery", per_page: 20 }, { signal }), []);
  const requests = paginated(mine.data).rows;
  const orders = paginated(delivered.data).rows;
  // an order with a request still open can't take another one yet
  const inProgress = new Set(requests.filter((r) => ["Requested", "Approved"].includes(r.status)).map((r) => r.order?.id));

  return (
    <AccountShell>
      <div className="panel">
        <div className="panel-body p-4">
          <div className="eyebrow">After delivery</div>
          <h2 style={{ fontSize: "var(--fs-5xl)", margin: 0 }}>Returns &amp; Refunds</h2>
          <p className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>Send back something from a delivered order, and follow your requests.</p>

          <h6 className="mt-4">Ask for a return</h6>
          {delivered.loading ? (
            <p className="text-mute">Loading…</p>
          ) : orders.length === 0 ? (
            <p className="text-mute mb-0">Only delivered orders can be returned. You have none yet.</p>
          ) : (
            <div className="d-grid gap-2">
              {orders.map((o) => (
                <div key={o.id} className="d-flex align-items-center justify-content-between gap-3 py-2 border-bottom">
                  <span><b>{o.invoice_no}</b> <span className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>· delivered order from {dateShort(o.date)}</span></span>
                  {inProgress.has(o.id)
                    ? <span className="status-pill pending">Return in progress</span>
                    : <Link className="btn btn-outline-line" to={`/account/orders/${o.id}#returns`}>Return items</Link>}
                </div>
              ))}
            </div>
          )}

          <h6 className="mt-5">Your requests</h6>
          {mine.loading ? (
            <p className="text-mute">Loading…</p>
          ) : mine.error ? (
            <p style={{ color: "var(--danger)" }}>{mine.error.message}</p>
          ) : requests.length === 0 ? (
            <div className="dash-empty"><p className="text-mute mb-0">You have not asked for a return yet.</p></div>
          ) : (
            <div className="d-grid gap-3">{requests.map((r) => <ReturnCard key={r.id} item={r} showOrder />)}</div>
          )}
        </div>
      </div>
    </AccountShell>
  );
}
