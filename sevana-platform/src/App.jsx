import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./shared/AuthContext";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import AppRoutes from "./AppRoutes";
import "./design-system.css";
import "./modules/donations/App.css";

export default function App() {
  return <BrowserRouter><AuthProvider><Navbar /><main className="app-main"><AppRoutes /></main><Footer /></AuthProvider></BrowserRouter>;
}
