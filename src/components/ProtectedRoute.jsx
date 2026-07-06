import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

// Gate a route behind login. Unauthenticated users are sent to /login
// (the page they wanted is remembered in location state for post-login redirect).
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};

export default ProtectedRoute;
