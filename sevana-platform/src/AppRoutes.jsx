import { Route, Routes } from "react-router-dom";
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
import ModerationConsole from "./modules/donations/pages/AdminConsole";
import OrganizationRegistration from "./modules/donations/pages/OrganizationRegistration";
import AdminConsole from "./modules/donations/pages/AdminConsole";
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

export default function AppRoutes() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} />
    <Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<Dashboard />} /><Route path="/organization" element={<OrganizationDashboard />} /><Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/moderation" element={<ModerationConsole />} />
    <Route path="/beneficiaries" element={<Beneficiaries />} /><Route path="/analytics" element={<Analytics />} /><Route path="/notifications" element={<Notifications />} />
    <Route path="/campaigns" element={<Campaigns />} /><Route path="/campaigns/:id" element={<CampaignDetail />} /><Route path="/donate" element={<Donate />} /><Route path="/manage-campaigns" element={<CampaignManager />} /><Route path="/register-organization" element={<OrganizationRegistration />} />
    <Route path="/ngo-partners" element={<NGOPartners />} /><Route path="/ngo-partners/:id" element={<NGOProfile />} /><Route path="/impact" element={<Impact />} /><Route path="/leaderboard" element={<DonorLeaderboard />} />
    <Route path="/camps" element={<Camps />} /><Route path="/camps/:id" element={<CampDetail />} /><Route path="/camps/:id/join" element={<JoinCamp />} /><Route path="/organize" element={<OrganizeCamp />} /><Route path="/manage-camps" element={<CampManager />} />
    <Route path="/organizers" element={<Organizers />} /><Route path="/organizers/:id" element={<OrganizerProfile />} /><Route path="/past-camps" element={<PastCamps />} /><Route path="/profile" element={<WorkerProfile />} /><Route path="/profile/:id" element={<WorkerProfile />} /><Route path="/invitations" element={<Invitations />} /><Route path="/volunteer-leaderboard" element={<VolunteerLeaderboard />} />
    <Route path="*" element={<NotFound />} />
  </Routes>;
}
