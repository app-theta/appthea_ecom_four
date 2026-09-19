import { Link, useNavigate } from "react-router-dom";
import { money } from "../data/site.js";
import { useCart } from "../context/CartContext.jsx";
import CartLine from "../components/CartLine.jsx";

const DISTRICTS = ["Dhaka", "Chattogram", "Sirajganj", "Rajshahi", "Khulna", "Sylhet"];

export default function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();

  return (
    <section className="section">
      <div className="container-x">
        <form className="row g-4" onSubmit={(e) => { e.preventDefault(); navigate("/order-success"); }}>
          <div className="col-lg-8">
            <div className="panel mb-4">
              <div className="panel-body p-4">
                <div className="eyebrow">Delivery details</div>
                <h2 style={{ fontSize: "var(--fs-7xl)", marginBottom: 22 }}>Customer Details</h2>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Full Name <span className="req">*</span></label>
                    <input className="form-control" required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone Number <span className="req">*</span></label>
                    <input className="form-control" required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Full Address <span className="req">*</span></label>
                    <textarea className="form-control" rows="4" required></textarea>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Email Address <span className="opt">Optional</span></label>
                    <input type="email" className="form-control" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">District <span className="req">*</span></label>
                    <select className="form-select" required>
                      <option value="">Select district</option>
                      {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Area / Thana / Upazila <span className="req">*</span></label>
                    <select className="form-select" required>
                      <option value="">Select area</option>
                      <option>Raiganj</option>
                      <option>Mirpur</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Order Note <span className="opt">Optional</span></label>
                    <textarea className="form-control" rows="3"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel mb-4">
              <div className="panel-body p-4">
                <div className="eyebrow">Delivery method</div>
                <h2 style={{ fontSize: "var(--fs-7xl)", marginBottom: 20 }}>Choose Shipping</h2>
                <label className="option-card" style={{ maxWidth: 420 }}>
                  <input className="form-check-input mt-1" type="radio" name="ship" defaultChecked />
                  <span>
                    <h6>Standard Delivery</h6>
                    <p>No active shipping charge is configured.</p>
                    <span className="price">৳0</span>
                  </span>
                </label>
              </div>
            </div>

            <div className="panel">
              <div className="panel-body p-4">
                <div className="eyebrow">Payment</div>
                <h2 style={{ fontSize: "var(--fs-7xl)", marginBottom: 20 }}>Choose Payment Method</h2>
                <label className="option-card" style={{ maxWidth: 420 }}>
                  <input className="form-check-input mt-1" type="radio" name="pay" defaultChecked />
                  <span>
                    <h6>Cash on Delivery</h6>
                    <p>Pay the courier when your order is delivered.</p>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="panel">
              <div className="panel-head">
                <h5>Order Summary</h5>
                <span className="muted-pill">{cart.count} item(s)</span>
              </div>
              <div className="panel-body pt-0">
                {cart.detailed.length ? (
                  cart.detailed.map((p) => <CartLine key={p.id} item={p} />)
                ) : (
                  <p className="text-mute mb-0" style={{ fontSize: "var(--fs-sm)" }}>
                    No product in cart. <Link to="/shop">Go to shop</Link>
                  </p>
                )}
              </div>
              <div className="panel-body border-top">
                <label className="form-label">Coupon Code</label>
                <div className="d-flex gap-2">
                  <input className="form-control" placeholder="Enter coupon" />
                  <button type="button" className="btn btn-ink">Apply</button>
                </div>
              </div>
              <div className="panel-body border-top">
                <div className="sum-row"><span className="label">Subtotal</span><b>{money(cart.subtotal)}</b></div>
                <div className="sum-row"><span className="label">Shipping</span><b>৳0</b></div>
                <div className="sum-row"><span className="label" style={{ color: "var(--success)" }}>Discount</span><b>-৳0</b></div>
                <div className="sum-row"><span className="label">Payment Fee</span><b>৳0</b></div>
                <div className="sum-total mb-3"><span className="t">Total</span><span className="v">{money(cart.subtotal)}</span></div>
                <button className="btn btn-accent w-100" style={{ padding: 14, fontSize: "var(--fs-lg)" }}>Place Order</button>
                <div className="note-box mt-3">Your checkout data is validated and protected.</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
