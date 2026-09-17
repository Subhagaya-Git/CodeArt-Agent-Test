import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <Spinner />;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;
  return children;
};

export default AdminRoute;