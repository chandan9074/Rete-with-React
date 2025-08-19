import React from "react";
import { Route } from "react-router-dom";
import Login from "../pages/Login";
import { PublicRoute } from "../components/RouteGuards";
import { ROUTE_SLUGS } from "../helpers/routeSlugs";

// Public routes - accessible without authentication
export const publicRoutes = [
    <Route
        key="login"
        path={ROUTE_SLUGS.LOGIN}
        element={
            <PublicRoute>
                <Login />
            </PublicRoute>
        }
    />,
];
