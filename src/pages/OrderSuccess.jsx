import { Link } from "react-router-dom";
import { PH_PRODUCT } from "../data/site.js";

const ITEMS = [
  ["Lorem ipsum book seven", "৳200"],
  ["Skin1004 Madagascar Centella Hyalu Cica Water Fit Sunscreen 50ml", "৳520"]
];
const META = [
  ["Order Number", "#145", true],
  ["Order Date", "19 Sep 2026", false],
  ["Total", "৳720", false],
  ["Payment", "Unpaid", false]
];

export default function OrderSuccess() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="alert-x mb-4">
          Order created, but the online payment page could not be opened. You can retry payment from the order page.
        </div>

        <div className="panel">
          <div className="success-top">
            <div className="success-ico"><i className="bi bi-check2"></i></div>
            <h1>Your order was received. Complete payment to continue.</h1>
            <p>The order is saved, but the online payment is still pending.</p>
            <div className="meta-grid">
              {META.map(([k, v, accent]) => (
                <div className="meta-card" key={k}>
                  <div className="k">{k}</div>
                  <div className={"v" + (accent ? "" : " ink")}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-body p-4">
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="panel">
                  <div className="panel-head">
                    <h5>Order Items</h5>
                    <span className="text-mute" style={{ fontSize: "var(--fs-sm)" }}>2 item(s)</span>
                  </div>
                  <div className="panel-body d-grid gap-3">
                    {ITEMS.map(([n, p]) => (
                      <div className="order-item" key={n}>
                        <div className="thumb"><img src={PH_PRODUCT} alt={n} /></div>
                        <div>
                          <div className="d-flex justify-content-between gap-3">
                            <b style={{ fontSize: "var(--fs-sm)" }}>{n}</b>
                            <b style={{ color: "var(--accent)" }}>{p}</b>
                          </div>
                          <div className="d-flex justify-content-between gap-3 mt-2" style={{ fontSize: "var(--fs-2xs)", color: "var(--ink-soft)" }}>
                            <span><b>Quantity:</b> 1</span><span>{p} each</span>
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
                    <div className="sum-row"><span className="label">Subtotal</span><b>৳720</b></div>
                    <div className="sum-row"><span className="label">Shipping</span><b>৳0</b></div>
                    <div className="sum-total"><span className="t">Total</span><span className="v">৳720</span></div>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-head"><h5>Delivery Information</h5></div>
                  <div className="panel-body info-block">
                    <div className="k">Customer</div><div className="v">Tumi Ami</div>
                    <div className="k">Phone</div><div className="v">3216457980</div>
                    <div className="k">Address</div><div className="v">dsfasdfas dfasdf, Raiganj, Sirajganj</div>
                    <div className="k">Status</div><div><span className="status-pill pending">Pending</span></div>
                  </div>
                </div>

                <div className="text-center my-4">
                  <a href="#" style={{ fontWeight: 700, color: "var(--ink-soft)" }}>Pay Now</a>
                </div>
                <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
                  <Link to="/shop" style={{ color: "var(--ink-soft)", fontWeight: 600 }}>Continue Shopping</Link>
                  <Link className="btn btn-outline-line" to="/track-order">Track Order</Link>
                </div>
                <div className="note-box mt-4">Keep your order number for future tracking.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
