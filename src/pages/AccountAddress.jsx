import { Link } from "react-router-dom";
import AccountShell from "../components/AccountShell.jsx";

export default function AccountAddress() {
  return (
    <AccountShell>
      <div className="panel">
        <div className="panel-body p-4">
          <div className="eyebrow">Shipping</div>
          <h2 style={{ fontSize: "var(--fs-5xl)", margin: "0 0 20px" }}>Saved Address</h2>
          <div className="order-row mb-3">
            <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
              <div className="info-block">
                <div className="k">Customer</div><div className="v">Tumi Ami</div>
                <div className="k">Phone</div><div className="v">3216457980</div>
                <div className="k">Address</div><div className="v mb-0">dsfasdfas dfasdf, Raiganj, Sirajganj</div>
              </div>
              <span className="muted-pill">Default</span>
            </div>
          </div>
          <Link className="btn btn-outline-line" to="/account/profile">Edit Address</Link>
        </div>
      </div>
    </AccountShell>
  );
}
