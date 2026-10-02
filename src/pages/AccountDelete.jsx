import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountShell from "../components/AccountShell.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { account } from "../api/endpoints.js";
import { parseApiError } from "../api/errors.js";

const errorStyle = { color: "var(--danger)", fontSize: "var(--fs-xs)" };

/** Closes the customer's account for good - the password and an "I understand" tick are both required. */
export default function AccountDelete() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErrors({}); setMessage("");
    try {
      await account.deleteAccount({ password, agree });
      // leave the account pages first, then drop the (already revoked) session
      navigate("/login", { replace: true, state: { notice: "Your account was deleted." } });
      logout();
    } catch (err) {
      const parsed = parseApiError(err);
      setErrors(parsed.fields);
      if (!Object.keys(parsed.fields).length) setMessage(parsed.message);
      setBusy(false);
    }
  };

  return (
    <AccountShell>
      <div className="panel">
        <div className="panel-body p-4">
          <div className="eyebrow" style={{ color: "var(--danger)" }}>Danger zone</div>
          <h2 style={{ fontSize: "var(--fs-5xl)", margin: "0 0 12px" }}>Delete your account</h2>
          <p className="text-mute">This closes your account at this shop for good. Before you go:</p>
          <ul className="text-mute mb-4">
            <li>You will be signed out on every device.</li>
            <li>Your orders, wishlist, reviews and chat will no longer show here.</li>
            <li>Orders you placed stay with the shop for its records.</li>
            <li>You can sign up again later with the same email or phone.</li>
          </ul>

          <form onSubmit={submit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="delete-password">Password</label>
                <input id="delete-password" type="password" autoComplete="current-password" className="form-control"
                       value={password} onChange={(e) => setPassword(e.target.value)} required />
                {errors.password && <p className="mb-0 mt-1" style={errorStyle}>{errors.password}</p>}
                <p className="text-mute mb-0 mt-2" style={{ fontSize: "var(--fs-xs)" }}>
                  Signed in with Google or Facebook? Set a password first with <Link to="/forgot-password">Forgot password</Link>.
                </p>
              </div>
              <div className="col-12">
                <div className="form-check">
                  <input id="delete-agree" type="checkbox" className="form-check-input" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                  <label className="form-check-label" htmlFor="delete-agree">I understand this cannot be undone</label>
                </div>
                {errors.agree && <p className="mb-0 mt-1" style={errorStyle}>{errors.agree}</p>}
              </div>
            </div>
            {message && <p className="mt-3 mb-0" style={{ color: "var(--danger)", fontSize: "var(--fs-sm)" }}>{message}</p>}
            <button className="btn btn-danger mt-4" style={{ padding: "12px 22px" }} disabled={busy || !agree || !password}>
              {busy ? "Deleting…" : "Delete my account"}
            </button>
          </form>
        </div>
      </div>
    </AccountShell>
  );
}
