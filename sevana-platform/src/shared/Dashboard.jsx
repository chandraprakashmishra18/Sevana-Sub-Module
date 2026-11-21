import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./useAuth";
import { getAllCampaigns } from "../modules/donations/services/campaignService";
import { getAllCamps } from "../modules/camps/services/campService";
import { getMyProfile } from "../modules/donations/services/userService";
import { getMyCampRegistrations } from "../modules/camps/services/joinService";
import { getDonationHistory } from "../modules/donations/services/donationService";

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ campaigns: [], camps: [], profile: null, registrations: [], donations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([getAllCampaigns(), getAllCamps(), getMyProfile(), getMyCampRegistrations(), getDonationHistory()])
      .then(([campaigns, camps, profile, registrations, donations]) => { if (active) setData({ campaigns, camps, profile, registrations, donations }); })
      .catch((e) => { if (active) setError(e.message || "Unable to load your account activity."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const name = data.profile?.fullName || user?.name || "";
  const pending = data.donations.filter((item) => item.status !== "SUCCESSFUL");
  const stats = [["Camp registrations", data.registrations.length, "Current registrations from your account"], ["Verified attendance", data.profile?.verifiedAttendanceCount || 0, "Attendance recorded by camp organizers"], ["Donation intents", pending.length, "Payment is pending until confirmed by a provider"], ["XP", data.profile?.totalXP || 0, "Earned from verified community activity"]];
  return <section className="unified-workspace"><div className="container"><header className="unified-workspace__header"><div><span className="unified-workspace__eyebrow">YOUR SEVANA ACCOUNT</span><h1>Welcome{name ? `, ${name.split(" ")[0]}` : ""}</h1><p>Review activity linked to your account.</p></div><Link className="unified-workspace__primary" to="/campaigns">Find an initiative</Link></header>
    {error && <p className="unified-workspace__notice" role="alert">{error}</p>}{loading ? <p role="status">Loading your account activity…</p> : <><div className="unified-workspace__grid">{stats.map(([label, value, note]) => <article className="unified-workspace__card" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</div><div className="unified-workspace__columns"><section className="unified-workspace__panel"><h2>Discover initiatives</h2><div className="unified-workspace__rows">{data.campaigns.slice(0, 3).map((item) => <div className="unified-workspace__row" key={item.id}><div><strong>{item.title}</strong><small>{item.ngo} · {item.location}</small></div><Link to={`/campaigns/${item.id}`}>View</Link></div>)}{data.camps.slice(0, 3).map((item) => <div className="unified-workspace__row" key={item.id}><div><strong>{item.title}</strong><small>{item.organizer} · {item.location}</small></div><Link to={`/camps/${item.id}`}>View</Link></div>)}{!data.campaigns.length && !data.camps.length && <p>No published initiatives are available.</p>}</div></section><section className="unified-workspace__panel"><h2>Your workspace</h2><div className="unified-workspace__actions"><Link to="/notifications">Notifications</Link><Link to="/profile">Profile & activities</Link><Link to="/volunteer-leaderboard">Community leaderboard</Link><Link to="/invitations">Camp invitations</Link></div></section></div></>}</div></section>;
}
