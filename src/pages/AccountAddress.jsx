import { Link } from "react-router-dom";
import AccountShell from "../components/AccountShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function AccountAddress() {
  const { customer } = useAuth();
  const name = [customer?.first_name, customer?.last_name].filter(Boolean).join(" ") || customer?.name || "";
  const hasAddress = Boolean(customer?.address);

  return (
    <AccountShell>
      <div className="panel">
        <div className="panel-body p-4">
          <div className="eyebrow">Shipping</div>
          <h2 style={{ fontSize: "var(--fs-5xl)", margin: "0 0 20px" }}>Saved Address</h2>
          {hasAddress ? (
            <div className="order-row mb-3">
              <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
                <div className="info-block">
                  <div className="k">Customer</div><div className="v">{name}</div>
                  <div className="k">Phone</div><div className="v">{customer?.phone}</div>
                  <div className="k">Address</div>
                  <div className="v mb-0">{[customer?.address, customer?.city, customer?.country].filter(Boolean).join(", ")}</div>
                </div>
                <span className="muted-pill">Default</span>
              </div>
            </div>
          ) : (
            <div className="dash-empty mb-3">
              <h4 style={{ fontSize: "var(--fs-5xl)" }}>No address saved yet</h4>
              <p className="text-mute mb-0">Add an address so checkout can be pre-filled for you.</p>
            </div>
          )}
          <Link className="btn btn-outline-line" to="/account/profile">Edit Address</Link>
        </div>
      </div>
    </AccountShell>
  );
}
