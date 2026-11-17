import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter basename="/camps">
      <AuthProvider>
        <Navbar />
        <aside className="staging-demo-banner" role="note">
          STAGING DEMO · Use synthetic data only. Camp registrations, XP, badges,
          leaderboards, and organizer actions are sample/local records, not verified activity.
        </aside>
        <main className="app-main">
          <AppRoutes />
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
