import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spin } from "antd";
import { ROUTE_SLUGS, DEFAULT_ROUTES } from "../helpers/routeSlugs";

// PrivateRoute component - only accessible when authenticated
export const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#2D2E2E]">
                <Spin size="large" />
            </div>
        );
    }

    if (!isAuthenticated()) {
        // Redirect to login page with return url
        return (
            <Navigate
                to={ROUTE_SLUGS.LOGIN}
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
};

// PublicRoute component - only accessible when NOT authenticated (like login page)
export const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#2D2E2E]">
                <Spin size="large" />
            </div>
        );
    }

    if (isAuthenticated()) {
        // Redirect to dashboard if already logged in
        return <Navigate to={DEFAULT_ROUTES.AUTHENTICATED} replace />;
    }

    return children;
};
