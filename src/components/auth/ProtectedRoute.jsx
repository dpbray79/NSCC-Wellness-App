import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
    const { session, loading } = useAuth();

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading session...</div>;
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
