import { Link } from "react-router-dom";
import AccountShell from "../components/AccountShell.jsx";

const STATS = [["Total Orders", "0"], ["In Progress", "0"], ["Completed", "0"]];

export default function Account() {
  return (
    <AccountShell>
      <div className="panel">
        <div className="panel-body p-4">
          <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
            <div>
              <div className="eyebrow">Overview</div>
              <h2 style={{ fontSize: "var(--fs-5xl)", margin: 0 }}>Welcome, Tumi Ami</h2>
            </div>
            <Link className="btn btn-outline-line" to="/shop">Continue Shopping</Link>
          </div>

          <div className="row g-3 mb-4">
            {STATS.map(([k, v]) => (
              <div className="col-md-4" key={k}>
                <div className="stat-card"><div className="k">{k}</div><div className="v">{v}</div></div>
              </div>
            ))}
          </div>

          <h5 style={{ fontSize: "var(--fs-xl)" }}>Recent Orders</h5>
          <div className="dash-empty">
            <h4 style={{ fontSize: "var(--fs-5xl)" }}>No orders found</h4>
            <p className="text-mute">Your placed orders will appear here.</p>
            <Link className="btn btn-accent" to="/shop">Start Shopping</Link>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
