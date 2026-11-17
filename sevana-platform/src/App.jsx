import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./shared/AuthContext";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import AppRoutes from "./AppRoutes";
import "./shared/DemoModeBanner.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <aside className="demo-mode-banner" role="note">
          STAGING DEMO · Use synthetic sample data only. Do not enter real
          personal, donor, beneficiary, or organization information. Payments
          are not processed; receipts, XP, leaderboards, camp activity, and
          organization review are demonstrations only.
        </aside>
        <main className="app-main"><AppRoutes /></main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
