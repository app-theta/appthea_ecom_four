import { Link } from "react-router-dom";
import AccountShell from "../components/AccountShell.jsx";

export default function AccountOrders() {
  return (
    <AccountShell>
      <div className="panel">
        <div className="panel-body p-4">
          <div className="eyebrow">History</div>
          <h2 style={{ fontSize: "var(--fs-5xl)", margin: "0 0 20px" }}>All Orders</h2>
          <div className="order-row">
            <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap pb-3 border-bottom">
              <div><b>Order #145</b> <span className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>19 Sep 2026, 01:20 PM</span></div>
              <span className="status-pill">Pending</span>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap pt-3">
              <span style={{ fontSize: "var(--fs-sm)" }}>Total <b>৳720</b></span>
              <span style={{ fontSize: "var(--fs-sm)" }}>Payment <b>Unpaid</b></span>
              <Link to="/track-order" style={{ fontWeight: 700 }}>Track Order</Link>
            </div>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}
