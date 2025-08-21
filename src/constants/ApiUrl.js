// export const BACKEND_BASE_URL = "https://auto-x.zaag-testing.ems24.co";
export const BACKEND_BASE_URL = "http://192.168.10.68:7890";

// Workflow API URLs
export const WORKFLOW_LIST = `${BACKEND_BASE_URL}/api/1.0.0/secured/workflows`;
export const WORKFLOW_BY_ID = `${BACKEND_BASE_URL}/api/1.0.0/secured/workflows`;
export const WORKFLOW_DELETE_BY_ID = `${BACKEND_BASE_URL}/api/1.0.0/secured/workflows/delete`;
export const WORKFLOW_EXECUTE_BY_ID = `${BACKEND_BASE_URL}/api/1.0.0/secured/workflows/execute`;
export const WORKFLOW_SINGLE_NODE_EXECUTE_BY_ID = `${BACKEND_BASE_URL}/api/1.0.0/secured/workflows/execute`;
export const WORKFLOW_CREATE = `${BACKEND_BASE_URL}/api/1.0.0/secured/workflows/create`;
export const WORKFLOW_UPDATE = `${BACKEND_BASE_URL}/api/1.0.0/secured/workflows/update`;

// Auth API URLs
export const AUTH_LOGIN = `${BACKEND_BASE_URL}/api/1.0.0/auth/admin/login`;
export const AUTH_LOGOUT = `${BACKEND_BASE_URL}/api/auth/logout`;
export const AUTH_REFRESH = `${BACKEND_BASE_URL}/api/auth/refresh`;
