import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Campaigns from "../pages/Campaigns";
import CampaignDetail from "../pages/CampaignDetail";
import Donate from "../pages/Donate";
import NGOPartners from "../pages/NGOPartners";
import NGOProfilePage from "../pages/NGOProfilePage";
import ImpactTransparency from "../pages/ImpactTransparency";
import DonorLeaderboardPage from "../pages/DonorLeaderboardPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";
import CrossModuleBridge from "../components/common/CrossModuleBridge";
import Dashboard from "../pages/Dashboard";
import CampaignManager from "../pages/CampaignManager";
import Notifications from "../pages/Notifications";
import OrganizationRegistration from "../pages/OrganizationRegistration";
import AdminConsole from "../pages/AdminConsole";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/campaigns" element={<Campaigns />} />
      <Route path="/campaigns/:id" element={<CampaignDetail />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/ngo-partners" element={<NGOPartners />} />
      <Route path="/ngo-partners/:id" element={<NGOProfilePage />} />
      <Route path="/impact" element={<ImpactTransparency />} />
      <Route path="/leaderboard" element={<DonorLeaderboardPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/manage-campaigns" element={<CampaignManager />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/register-organization" element={<OrganizationRegistration />} />
      <Route path="/admin" element={<AdminConsole />} />

      {/* Cross-module redirects from Donations (5173) to Camps (5174) */}
      <Route path="/camps" element={<CrossModuleBridge targetPort={5174} targetTitle="Sevana Camps & Community Service" />} />
      <Route path="/camps/:id" element={<CrossModuleBridge targetPort={5174} targetTitle="Sevana Camps & Community Service" />} />
      <Route path="/camps/:id/join" element={<CrossModuleBridge targetPort={5174} targetTitle="Sevana Camps & Community Service" />} />
      <Route path="/organize" element={<CrossModuleBridge targetPort={5174} targetTitle="Sevana Camps & Community Service" />} />
      <Route path="/organizers" element={<CrossModuleBridge targetPort={5174} targetTitle="Sevana Camps & Community Service" />} />
      <Route path="/past-camps" element={<CrossModuleBridge targetPort={5174} targetTitle="Sevana Camps & Community Service" />} />
      <Route path="/invitations" element={<CrossModuleBridge targetPort={5174} targetTitle="Sevana Camps & Community Service" />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
