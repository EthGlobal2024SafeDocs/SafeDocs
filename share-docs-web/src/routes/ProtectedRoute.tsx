import { Navigate } from "react-router-dom"
// import { useAppStore } from "../store/useAppStore";
import { useContext } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContext";

type ProtectedRoute = {
  children?: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRoute) => {
  const auth = useContext(AuthContext) as AuthContextType;
  // const { isAuthenticated } = useAppStore();
  return auth.isAuthenticated()
    ? children
    : <Navigate to="/" replace />
};

export default ProtectedRoute;