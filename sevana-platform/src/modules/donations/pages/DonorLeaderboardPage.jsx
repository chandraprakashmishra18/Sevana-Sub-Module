import { Link } from "react-router-dom";
import "./DonorLeaderboardPage.css";

export default function DonorLeaderboardPage(){return <section className="donor-leaderboard-page"><div className="container"><div className="donor-leaderboard-page__header"><h1>Community Donor Leaderboard</h1><p>A public donor leaderboard is not available yet. Sevana will show rankings after it has verified payment data and a privacy-safe leaderboard endpoint.</p></div><div className="donor-leaderboard-page__link"><Link to="/campaigns">Browse campaigns</Link></div></div></section>}
