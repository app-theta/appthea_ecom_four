import { useState } from "react";
import AccountShell from "../components/AccountShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { auth as authApi } from "../api/endpoints.js";
import { parseApiError } from "../api/errors.js";

export default function AccountProfile() {
  const { customer, setCustomer } = useAuth();
  const [form, setForm] = useState({
    first_name: customer?.first_name || "",
    last_name: customer?.last_name || "",
    address: customer?.address || "",
    city: customer?.city || "",
    country: customer?.country || "Bangladesh",
  });
  const [errors, setErrors] = useState({});
  const [savedMsg, setSavedMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const [pwd, setPwd] = useState({ old_password: "", password: "", password_confirmation: "" });
  const [pwdErrors, setPwdErrors] = useState({});
  const [pwdMsg, setPwdMsg] = useState("");
  const [pwdBusy, setPwdBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true); setErrors({}); setSavedMsg("");
    try {
      const data = await authApi.updateProfile(form);
      setCustomer(data?.customer || data || customer);
      setSavedMsg("Profile updated successfully.");
    } catch (err) {
      const parsed = parseApiError(err);
      setErrors(parsed.fields);
      setSavedMsg(parsed.message);
    } finally { setSaving(false); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwdBusy(true); setPwdErrors({}); setPwdMsg("");
    try {
      await authApi.changePassword(pwd);
      setPwd({ old_password: "", password: "", password_confirmation: "" });
      setPwdMsg("Password changed successfully.");
    } catch (err) {
      const parsed = parseApiError(err);
      setPwdErrors(parsed.fields);
      setPwdMsg(parsed.message);
    } finally { setPwdBusy(false); }
  };

  return (
    <AccountShell>
      <div className="panel mb-4">
        <div className="panel-body p-4">
          <div className="eyebrow">Settings</div>
          <h2 style={{ fontSize: "var(--fs-5xl)", margin: "0 0 20px" }}>Profile Information</h2>
          <form onSubmit={saveProfile}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input className="form-control" value={form.first_name} onChange={set("first_name")} required />
                {errors.first_name && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{errors.first_name}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input className="form-control" value={form.last_name} onChange={set("last_name")} required />
                {errors.last_name && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{errors.last_name}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input className="form-control" value={customer?.phone || ""} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input className="form-control" value={customer?.email || ""} disabled />
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input className="form-control" value={form.city} onChange={set("city")} required />
                {errors.city && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{errors.city}</p>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Country</label>
                <input className="form-control" value={form.country} onChange={set("country")} required />
                {errors.country && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{errors.country}</p>}
              </div>
              <div className="col-12">
                <label className="form-label">Address</label>
                <textarea className="form-control" rows="4" value={form.address} onChange={set("address")} required></textarea>
                {errors.address && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{errors.address}</p>}
              </div>
            </div>
            {savedMsg && <p className="mt-3 mb-0" style={{ color: savedMsg.includes("success") ? "var(--success)" : "var(--danger)", fontSize: "var(--fs-sm)" }}>{savedMsg}</p>}
            <button className="btn btn-accent w-100 mt-4" style={{ padding: 13, fontSize: "var(--fs-lg)" }} disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>

      <div className="panel">
        <div className="panel-body p-4">
          <div className="eyebrow">Security</div>
          <h2 style={{ fontSize: "var(--fs-5xl)", margin: "0 0 20px" }}>Change Password</h2>
          <form onSubmit={changePassword}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-control" value={pwd.old_password} onChange={(e) => setPwd({ ...pwd, old_password: e.target.value })} required />
                {pwdErrors.old_password && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{pwdErrors.old_password}</p>}
              </div>
              <div className="col-md-4">
                <label className="form-label">New Password</label>
                <input type="password" className="form-control" value={pwd.password} onChange={(e) => setPwd({ ...pwd, password: e.target.value })} required />
                {pwdErrors.password && <p className="mb-0 mt-1" style={{ color: "var(--danger)", fontSize: "var(--fs-xs)" }}>{pwdErrors.password}</p>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" value={pwd.password_confirmation} onChange={(e) => setPwd({ ...pwd, password_confirmation: e.target.value })} required />
              </div>
            </div>
            {pwdMsg && <p className="mt-3 mb-0" style={{ color: pwdMsg.includes("success") ? "var(--success)" : "var(--danger)", fontSize: "var(--fs-sm)" }}>{pwdMsg}</p>}
            <button className="btn btn-accent w-100 mt-4" style={{ padding: 13, fontSize: "var(--fs-lg)" }} disabled={pwdBusy}>
              {pwdBusy ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </AccountShell>
  );
}
