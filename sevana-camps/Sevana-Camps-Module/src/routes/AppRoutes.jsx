import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Camps from "../pages/Camps";
import CampDetail from "../pages/CampDetail";
import JoinCamp from "../pages/JoinCamp";
import OrganizeCamp from "../pages/OrganizeCamp";
import Organizers from "../pages/Organizers";
import OrganizerProfilePage from "../pages/OrganizerProfilePage";
import PastCamps from "../pages/PastCamps";
import WorkerProfile from "../pages/WorkerProfile";
import LeaderboardPage from "../pages/LeaderboardPage";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/camps" element={<Camps />} />
      <Route path="/camps/:id" element={<CampDetail />} />
      <Route path="/camps/:id/join" element={<JoinCamp />} />
      <Route path="/organize" element={<OrganizeCamp />} />
      <Route path="/organizers" element={<Organizers />} />
      <Route path="/organizers/:id" element={<OrganizerProfilePage />} />
      <Route path="/past-camps" element={<PastCamps />} />
      <Route path="/profile/:id" element={<WorkerProfile />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;