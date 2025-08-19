import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { publicRoutes } from "./PublicRoutes";
import { privateRoutes } from "./PrivateRoutes";
import { useAuth } from "../context/AuthContext";
import { DEFAULT_ROUTES } from "../helpers/routeSlugs";

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            {publicRoutes}

            {/* Private Routes */}
            {privateRoutes}

            {/* Catch all route - redirect based on auth status */}
            <Route
                path="*"
                element={
                    isAuthenticated() ? (
                        <Navigate to={DEFAULT_ROUTES.AUTHENTICATED} replace />
                    ) : (
                        <Navigate to={DEFAULT_ROUTES.UNAUTHENTICATED} replace />
                    )
                }
            />
        </Routes>
    );
};

export default AppRoutes;
