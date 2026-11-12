import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./modules/donations/index.css";
import "./design-system.css";
import App from "./App";
createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
