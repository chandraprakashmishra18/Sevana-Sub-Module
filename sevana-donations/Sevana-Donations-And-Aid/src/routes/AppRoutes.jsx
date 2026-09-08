import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Campaigns from "../pages/Campaigns";
import CampaignDetail from "../pages/CampaignDetail";
import Donate from "../pages/Donate";
import NGOPartners from "../pages/NGOPartners";
import NGOProfilePage from "../pages/NGOProfilePage";
import ImpactTransparency from "../pages/ImpactTransparency";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";

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
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;