import { Navigate } from "react-router-dom";

export default function OrganizationRegistration() {
  return <Navigate to="/register?type=organization" replace />;
}
