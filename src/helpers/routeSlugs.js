// Route slugs for the application
export const ROUTE_SLUGS = {
    // Public Routes
    LOGIN: "/login",

    // Private Routes
    HOME: "/",
    WORKFLOW_LIST: "/workflow-list",
    WORKFLOW: "/workflow",
};

// Helper function to build dynamic routes
export const buildRoute = (baseRoute, params = {}) => {
    let route = baseRoute;
    Object.entries(params).forEach(([key, value]) => {
        route = route.replace(`:${key}`, value);
    });
    return route;
};

// Default redirect routes
export const DEFAULT_ROUTES = {
    AUTHENTICATED: ROUTE_SLUGS.WORKFLOW_LIST,
    UNAUTHENTICATED: ROUTE_SLUGS.LOGIN,
};
