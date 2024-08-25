import { Navigate } from "react-router-dom"
import { useAppStore } from "../store/useAppStore";

type ProtectedRoute = {
  children?: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRoute) => {
  const { isAuthenticated } = useAppStore();
  return isAuthenticated
    ? children
    : <Navigate to="/" replace />
};

export default ProtectedRoute;