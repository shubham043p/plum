import { useContext, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const authContext = useContext(AuthContext);

  if (!authContext || authContext.loading) {
     return <div className="text-white text-center mt-20">Loading...</div>;
  }

  const { isAuthenticated } = authContext;

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default PrivateRoute;
