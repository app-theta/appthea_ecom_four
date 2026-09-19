import { Link } from "react-router-dom";

export default function TrackOrder() {
  return (
    <section className="section">
      <div className="container-x">
        <nav className="breadcrumb-x text-center"><Link to="/">Home</Link> <span>/</span> <span>Track Order</span></nav>
        <div className="section-head">
          <div className="eyebrow">Delivery status</div>
          <h1 className="page-title">Track Your Order</h1>
          <p>Enter the order number and phone used during checkout.</p>
        </div>

        <div className="panel mx-auto" style={{ maxWidth: 760 }}>
          <div className="panel-body p-4">
            <form className="row g-3 align-items-end" onSubmit={(e) => e.preventDefault()}>
              <div className="col-md-5">
                <label className="form-label">Order Number</label>
                <input className="form-control" placeholder="Example: 1024" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Phone Number</label>
                <input className="form-control" />
              </div>
              <div className="col-md-3">
                <button className="btn btn-accent w-100" style={{ padding: 12 }}>Track Order</button>
              </div>
            </form>
            <div className="note-box mt-4">The phone number must exactly match the checkout information.</div>
          </div>
        </div>
      </div>
    </section>
  );
}
