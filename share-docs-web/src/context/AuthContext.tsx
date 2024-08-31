import { ReactNode, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthState {
  token: string;
  expiresIn: number;
}

export type AuthContextType = {
  authState?: AuthState;
  setAuthState: (authInfo: AuthState) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const { Provider } = AuthContext;

const AuthProvider = ({ children }: { children: ReactNode | undefined }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const expiresIn = Number(localStorage.getItem('expiresIn'));

  const [authState, setAuthState] = useState<AuthState | undefined>(undefined);

  const initAuthState = () => {
    if (token && expiresIn > 0) {
      setAuthState({
        token,
        expiresIn
      });
    }
  };

  useEffect(() => {
    initAuthState();
  }, [token, expiresIn]);

  const setAuthInfo = (authInfo: AuthState) => {
    localStorage.setItem('token', authInfo.token);
    localStorage.setItem('expiresIn', authInfo.expiresIn.toString());
    setAuthState(authInfo);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    setAuthState(undefined);
    navigate('/');
  }

  const isAuthenticated = () => {
    return !authState?.token ? false : true;
  };

  return (
    <Provider
      value={{
        authState,
        setAuthState: (authInfo: AuthState) => setAuthInfo(authInfo),
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </Provider>
  );
};

export { AuthContext, AuthProvider };
