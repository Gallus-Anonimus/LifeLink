import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { fetchApi } from "../context/utils.ts";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetchApi("GET", "/auth/session-status");
                if (res.ok) {
                    const data = await res.json();
                    setIsAuthenticated(data.active === true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    // Show loading spinner while checking authentication
    if (isAuthenticated === null) {
        return (
            <div className="d-flex align-items-center justify-content-center py-5 bg-light" style={{ minHeight: "calc(100vh - 140px)" }}>
                <div className="text-center">
                    <Spinner animation="border" role="status" className="mb-3">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render protected content if authenticated
    return <>{children}</>;
};

