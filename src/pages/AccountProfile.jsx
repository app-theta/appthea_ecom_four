import AccountShell from "../components/AccountShell.jsx";

export default function AccountProfile() {
  return (
    <AccountShell>
      <div className="panel">
        <div className="panel-body p-4">
          <div className="eyebrow">Settings</div>
          <h2 style={{ fontSize: "var(--fs-5xl)", margin: "0 0 20px" }}>Profile Information</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="row g-3">
              <div className="col-md-6"><label className="form-label">Full Name</label><input className="form-control" defaultValue="Tumi Ami" /></div>
              <div className="col-md-6"><label className="form-label">Phone</label><input className="form-control" defaultValue="3216457980" /></div>
              <div className="col-md-6"><label className="form-label">Email</label><input className="form-control" defaultValue="tumiami@gmail.com" /></div>
              <div className="col-md-6"><label className="form-label">City or District</label><input className="form-control" defaultValue="Sirajganj" /></div>
              <div className="col-md-6"><label className="form-label">Area</label><input className="form-control" defaultValue="Raiganj" /></div>
              <div className="col-md-6"><label className="form-label">Postcode</label><input className="form-control" /></div>
              <div className="col-12"><label className="form-label">Address</label><textarea className="form-control" rows="4" defaultValue="dsfasdfas dfasdf"></textarea></div>
              <div className="col-md-6"><label className="form-label">New Password</label><input type="password" className="form-control" defaultValue="password123" /></div>
              <div className="col-md-6"><label className="form-label">Confirm Password</label><input type="password" className="form-control" /></div>
            </div>
            <button className="btn btn-accent w-100 mt-4" style={{ padding: 13, fontSize: "var(--fs-lg)" }}>Save Changes</button>
          </form>
        </div>
      </div>
    </AccountShell>
  );
}
