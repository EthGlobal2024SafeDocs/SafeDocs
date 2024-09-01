import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Welcome from '../components/pages/welcome/Welcome';
import User from '../components/pages/user/User';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import Document from '../components/pages/document/Document';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/user" element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          } />
          <Route path="/document" element={
            <ProtectedRoute>
              <Document />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Welcome />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRouter;