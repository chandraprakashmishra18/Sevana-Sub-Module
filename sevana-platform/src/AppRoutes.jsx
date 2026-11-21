import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./shared/useAuth";
import LandingPage from "./LandingPage";
import NotFound from "./modules/donations/pages/NotFound";
import Login from "./modules/donations/pages/Login";
import Register from "./modules/donations/pages/Register";
import About from "./modules/donations/pages/About";
import Contact from "./modules/donations/pages/Contact";
import Campaigns from "./modules/donations/pages/Campaigns";
import CampaignDetail from "./modules/donations/pages/CampaignDetail";
import Donate from "./modules/donations/pages/Donate";
import NGOPartners from "./modules/donations/pages/NGOPartners";
import NGOProfile from "./modules/donations/pages/NGOProfilePage";
import Impact from "./modules/donations/pages/ImpactTransparency";
import DonorLeaderboard from "./modules/donations/pages/DonorLeaderboardPage";
import CampaignManager from "./modules/donations/pages/CampaignManager";
import OrganizationRegistration from "./modules/donations/pages/OrganizationRegistration";

import Camps from "./modules/camps/pages/Camps";
import CampDetail from "./modules/camps/pages/CampDetail";
import JoinCamp from "./modules/camps/pages/JoinCamp";
import OrganizeCamp from "./modules/camps/pages/OrganizeCamp";
import Organizers from "./modules/camps/pages/Organizers";
import OrganizerProfile from "./modules/camps/pages/OrganizerProfilePage";
import PastCamps from "./modules/camps/pages/PastCamps";
import WorkerProfile from "./modules/camps/pages/WorkerProfile";
import VolunteerLeaderboard from "./modules/camps/pages/LeaderboardPage";
import Invitations from "./modules/camps/pages/InvitationsPage";
import CampManager from "./modules/camps/pages/CampManager";
import Dashboard from "./shared/Dashboard";
import OrganizationDashboard from "./shared/OrganizationDashboard";
import AdminDashboard from "./shared/AdminDashboard";
import Beneficiaries from "./shared/Beneficiaries";
import Analytics from "./shared/Analytics";
import Notifications from "./shared/Notifications";
import AdminRouteGate from "./shared/AdminRouteGate";

function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  if (loading) return <p className="container" role="status">Checking your session…</p>;
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

export default function AppRoutes() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} />
    <Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} /><Route path="/organization" element={<RequireAuth><OrganizationDashboard /></RequireAuth>} /><Route path="/admin" element={<RequireAuth><AdminRouteGate><AdminDashboard /></AdminRouteGate></RequireAuth>} />
    <Route path="/admin/moderation" element={<RequireAuth><AdminRouteGate><AdminDashboard /></AdminRouteGate></RequireAuth>} />
    <Route path="/beneficiaries" element={<Beneficiaries />} /><Route path="/analytics" element={<Analytics />} /><Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
    <Route path="/campaigns" element={<Campaigns />} /><Route path="/campaigns/:id" element={<CampaignDetail />} /><Route path="/donate" element={<RequireAuth><Donate /></RequireAuth>} /><Route path="/manage-campaigns" element={<RequireAuth><CampaignManager /></RequireAuth>} /><Route path="/register-organization" element={<RequireAuth><OrganizationRegistration /></RequireAuth>} />
    <Route path="/ngo-partners" element={<NGOPartners />} /><Route path="/ngo-partners/:id" element={<NGOProfile />} /><Route path="/impact" element={<Impact />} /><Route path="/leaderboard" element={<DonorLeaderboard />} />
    <Route path="/camps" element={<Camps />} /><Route path="/camps/:id" element={<CampDetail />} /><Route path="/camps/:id/join" element={<RequireAuth><JoinCamp /></RequireAuth>} /><Route path="/organize" element={<RequireAuth><OrganizeCamp /></RequireAuth>} /><Route path="/manage-camps" element={<RequireAuth><CampManager /></RequireAuth>} />
    <Route path="/organizers" element={<Organizers />} /><Route path="/organizers/:id" element={<OrganizerProfile />} /><Route path="/past-camps" element={<PastCamps />} /><Route path="/profile" element={<RequireAuth><WorkerProfile /></RequireAuth>} /><Route path="/profile/:id" element={<WorkerProfile />} /><Route path="/invitations" element={<RequireAuth><Invitations /></RequireAuth>} /><Route path="/volunteer-leaderboard" element={<VolunteerLeaderboard />} />
    <Route path="*" element={<NotFound />} />
  </Routes>;
}
