import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Welcome from '../components/pages/welcome/Welcome';
import User from '../components/pages/user/User';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/user" element={
          <ProtectedRoute>
            <User />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Welcome />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;