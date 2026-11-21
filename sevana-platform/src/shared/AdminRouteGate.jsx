import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "./apiClient";

export default function AdminRouteGate({ children }) {
  const navigate = useNavigate();
  const [state, setState] = useState("checking");
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    apiRequest("/admin/organizations?limit=1").then(() => { if (active) setState("allowed"); }).catch((cause) => {
      if (!active) return;
      if (cause.status === 401) navigate("/login", { replace: true });
      else { setState("denied"); setError(cause.status === 403 ? "Administrator access is required." : cause.message); }
    });
    return () => { active = false; };
  }, [navigate, retry]);
  if (state === "checking") return <p className="container" role="status">Verifying administrator access…</p>;
  if (state === "denied") return <main className="unified-workspace"><div className="container"><section className="unified-workspace__panel"><h1>Admin access unavailable</h1><p role="alert">{error}</p><button className="unified-workspace__secondary" onClick={() => { setState("checking"); setRetry((value) => value + 1); }}>Retry</button></section></div></main>;
  return children;
}
