import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../../shared/apiClient";
import "./Dashboard.css";
import "./Workflow.css";

export default function AdminConsole() {
  const [organizations,setOrganizations]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(""); const [message,setMessage]=useState("");
  const refresh=useCallback(async()=>{setLoading(true);setError("");try{const result=await apiRequest("/admin/organizations");setOrganizations(result.data||[])}catch(err){setError(err.message||"Could not load organization verification queue.")}finally{setLoading(false)}},[]);
  useEffect(()=>{refresh()},[refresh]);
  const verify=async(id,status)=>{setError("");setMessage("");try{const result=await apiRequest(`/admin/organizations/${encodeURIComponent(id)}/verification`,{method:"PATCH",body:{verificationStatus:status}});setMessage(result.message);await refresh()}catch(err){setError(err.message||"Could not update organization verification.")}};
  return <section className="workspace-dashboard"><div className="container"><div className="workspace-dashboard__top"><div><span className="workspace-dashboard__eyebrow">PLATFORM ADMIN</span><h1>Organization verification</h1><p>Review organization registrations submitted through the shared account system.</p></div><Link className="workspace-dashboard__link" to="/admin">← Admin dashboard</Link></div>
    {message&&<p role="status">{message}</p>}{error&&<p role="alert">{error}</p>}
    <section className="workspace-dashboard__panel"><h2>Pending organizations</h2>{loading?<p>Loading verification queue…</p>:organizations.length?organizations.map(org=><article className="manager-row" key={org.id}><div><strong>{org.name} · {org.type}</strong><small>{org.id} · status: {org.verificationStatus}</small></div><div className="manager-row__actions"><button type="button" onClick={()=>verify(org.id,"VERIFIED")}>Verify</button><button type="button" onClick={()=>verify(org.id,"REJECTED")}>Reject</button></div></article>):<p>No organizations are awaiting verification.</p>}</section>
    <section className="workspace-dashboard__panel" style={{marginTop:18}}><h2>Campaign moderation</h2><p>The current backend provides organization verification and organization-managed campaign status transitions. It does not provide an administrator campaign moderation endpoint.</p></section>
  </div></section>;
}
