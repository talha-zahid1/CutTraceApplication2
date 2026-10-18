
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { model_context } from '../Context/ApiContext';

function ProtectedRoute({ children }) {
    const { access_token } = useContext(model_context);

    return access_token
        ? children
        : <Navigate to="/"  />;
}

export default ProtectedRoute;
