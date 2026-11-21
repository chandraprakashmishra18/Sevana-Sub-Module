import { Link } from "react-router-dom";
import "./DonorLeaderboardPage.css";

export default function DonorLeaderboardPage() {
  return <section className="donor-leaderboard-page"><div className="container"><div className="donor-leaderboard-page__header"><h1>Donor leaderboard</h1><p>Donation rankings require a public, privacy-reviewed backend aggregation endpoint.</p></div><div className="donor-leaderboard-page__loading" role="status">Donor rankings are unavailable. No sample donors, donation amounts, or payment XP are displayed. See the <Link to="/volunteer-leaderboard">verified community XP leaderboard</Link>.</div></div></section>;
}
