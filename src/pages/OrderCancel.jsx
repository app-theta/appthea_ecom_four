import { Link, useSearchParams } from "react-router-dom";

/** Landing page for a cancelled/failed online payment gateway return - see
    redirectToFrontendAfterPayment() in the backend, which sends the browser
    here whenever bKash/Nagad/SSL/AamarPay/Stripe/PayPal comes back with
    anything other than success: /order/cancel?order=CODE&message=… */
export default function OrderCancel() {
  const [params] = useSearchParams();
  const code = params.get("order") || "";
  const message = params.get("message") || "";

  return (
    <section className="section">
      <div className="container-x">
        <div className="panel">
          <div className="success-top">
            <div className="cancel-ico"><i className="bi bi-x-lg"></i></div>
            <h1>Payment not completed</h1>
            <p>{message || "Your payment was cancelled or could not be completed. Your cart is still saved."}</p>
            {code && (
              <div className="meta-grid">
                <div className="meta-card">
                  <div className="k">Order Number</div>
                  <div className="v ink" style={{ wordBreak: "break-all" }}>{code}</div>
                </div>
              </div>
            )}
          </div>

          <div className="panel-body p-4 text-center">
            <p className="text-mute mb-4">You can retry payment or continue with a different payment method from checkout.</p>
            <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
              <Link className="btn btn-accent" to="/checkout">Try Again</Link>
              <Link className="btn btn-outline-line" to="/cart">View Cart</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
