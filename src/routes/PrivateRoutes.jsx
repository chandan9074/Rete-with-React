import React from "react";
import { Route, Navigate } from "react-router-dom";
import Canvas from "../workflow/Canvas";
import WorkflowList from "../pages/WorkflowList";
import { PrivateRoute } from "../components/RouteGuards";
import { ROUTE_SLUGS, DEFAULT_ROUTES } from "../helpers/routeSlugs";

// Private routes - require authentication
export const privateRoutes = [
    <Route
        key="root"
        path={ROUTE_SLUGS.HOME}
        element={
            <PrivateRoute>
                <Navigate to={DEFAULT_ROUTES.AUTHENTICATED} replace />
            </PrivateRoute>
        }
    />,
    <Route
        key="workflow-list"
        path={ROUTE_SLUGS.WORKFLOW_LIST}
        element={
            <PrivateRoute>
                <WorkflowList />
            </PrivateRoute>
        }
    />,
    <Route
        key="workflow"
        path={ROUTE_SLUGS.WORKFLOW}
        element={
            <PrivateRoute>
                <Canvas />
            </PrivateRoute>
        }
    />,
];
