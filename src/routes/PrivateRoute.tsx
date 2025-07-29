import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { store } from '../store/index';
import type { RootState } from '../store/index';


const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
