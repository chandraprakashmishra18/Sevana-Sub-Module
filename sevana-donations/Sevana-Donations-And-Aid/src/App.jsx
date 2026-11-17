import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter basename="/donations">
      <AuthProvider>
        <Navbar />
        <aside className="staging-demo-banner" role="note">
          STAGING DEMO · Use synthetic data only. Contributions are not payments;
          receipts are not tax documents; XP, rankings, and organization review are illustrative.
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
