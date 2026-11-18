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
          AUTHENTICATION CONNECTED · Account credentials are sent to the Sevana
          backend. Camps, donations, payments, receipts, XP, leaderboards, and
          organization review remain demonstrations. Do not enter real donor,
          beneficiary, or payment information.
        </aside>
        <main className="app-main"><AppRoutes /></main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}
