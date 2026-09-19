import { Link } from "react-router-dom";
import AccountShell from "../components/AccountShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useAsync } from "../hooks/useAsync.js";
import { account } from "../api/endpoints.js";
import { paginated } from "../utils/product.js";
import { statusTone, dateShort, money } from "../utils/format.js";
import { useBusiness } from "../context/BusinessContext.jsx";

export default function Account() {
  const { customer } = useAuth();
  const { currencySymbol } = useBusiness();
  const { data: dash } = useAsync((signal) => account.dashboard({ signal }), []);
  const { data: ordersData, loading } = useAsync((signal) => account.orders({ per_page: 50 }, { signal }), []);
  const rows = paginated(ordersData).rows;

  const completed = rows.filter((o) => o.sale_status === "Delivery").length;
  const inProgress = rows.filter((o) => ["Pending", "Processing", "Confirmed"].includes(o.sale_status)).length;
  const stats = [
    ["Total Orders", dash?.total_orders ?? "—"],
    ["In Progress", inProgress],
    ["Completed", completed],
  ];

  const name = [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") || customer?.name || "there";
  const recent = rows.slice(0, 5);

  return (
    <AccountShell>
      <div className="panel">
        <div className="panel-body p-4">
          <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
            <div>
              <div className="eyebrow">Overview</div>
              <h2 style={{ fontSize: "var(--fs-5xl)", margin: 0 }}>Welcome, {name}</h2>
            </div>
            <Link className="btn btn-outline-line" to="/shop">Continue Shopping</Link>
          </div>

          <div className="row g-3 mb-4">
            {stats.map(([k, v]) => (
              <div className="col-md-4" key={k}>
                <div className="stat-card"><div className="k">{k}</div><div className="v">{v}</div></div>
              </div>
            ))}
          </div>

          <h5 style={{ fontSize: "var(--fs-xl)" }}>Recent Orders</h5>
          {loading ? (
            <p className="text-mute">Loading orders…</p>
          ) : recent.length === 0 ? (
            <div className="dash-empty">
              <h4 style={{ fontSize: "var(--fs-5xl)" }}>No orders found</h4>
              <p className="text-mute">Your placed orders will appear here.</p>
              <Link className="btn btn-accent" to="/shop">Start Shopping</Link>
            </div>
          ) : (
            <div className="d-grid gap-3">
              {recent.map((o) => (
                <div className="order-row d-flex align-items-center justify-content-between flex-wrap gap-2" key={o.id}>
                  <div>
                    <b>{o.invoice_no || o.unique_code}</b>
                    <div className="text-mute" style={{ fontSize: "var(--fs-xs)" }}>{dateShort(o.date)}</div>
                  </div>
                  <span className={"status-pill" + (statusTone(o.sale_status) === "pending" ? " pending" : "")}>{o.sale_status}</span>
                  <b>{money(o.total_amount, currencySymbol)}</b>
                </div>
              ))}
              <Link to="/account/orders" style={{ fontWeight: 700 }}>View all orders →</Link>
            </div>
          )}
        </div>
      </div>
    </AccountShell>
  );
}
