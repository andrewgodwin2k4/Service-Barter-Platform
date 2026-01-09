import { useContext, useRef } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  const hasWarned = useRef(false);

  if (!token) {
    if (!hasWarned.current) {
      toast.warning("Login to access this page!");
      hasWarned.current = true;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
