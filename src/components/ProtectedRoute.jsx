"use client";

import { Navigate, useLocation } from "@/lib/router";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthed, booting } = useAuth();
  const location = useLocation();

  if (booting) {
    return (
      <section className="section">
        <div className="container-x text-center text-mute">Loading…</div>
      </section>
    );
  }
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
