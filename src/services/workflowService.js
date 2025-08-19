import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
    WORKFLOW_BY_ID,
    WORKFLOW_CREATE,
    WORKFLOW_DELETE_BY_ID,
    WORKFLOW_EXECUTE_BY_ID,
    WORKFLOW_LIST,
    WORKFLOW_SINGLE_NODE_EXECUTE_BY_ID,
    WORKFLOW_UPDATE,
} from "../constants/ApiUrl";
import { getAccessToken } from "./authService";

// Base URL for your API
// const BASE_URL = "https://auto-x.zaag-testing.ems24.co/api/1.0.0";

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = getAccessToken();

    console.log(token, "<--- Auth Token");
    return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// API endpoints
const ENDPOINTS = {
    WORKFLOW_LIST: `${WORKFLOW_LIST}`,
    WORKFLOW_BY_ID: (id) => `${WORKFLOW_BY_ID}/${id}`,
    WORKFLOW_DELETE_BY_ID: (id) => `${WORKFLOW_DELETE_BY_ID}/${id}`,
    WORKFLOW_CREATE: WORKFLOW_CREATE,
    WORKFLOW_UPDATE: (id) => `${WORKFLOW_UPDATE}/${id}`,
    WORKFLOW_EXECUTE_BY_ID: (id) => `${WORKFLOW_EXECUTE_BY_ID}/${id}`,
    WORKFLOW_SINGLE_NODE_EXECUTE_BY_ID: (id, nodeId) =>
        `${WORKFLOW_SINGLE_NODE_EXECUTE_BY_ID}/${id}/node/${nodeId}`,
};

// Query Keys
export const QUERY_KEYS = {
    WORKFLOWS: ["workflows"],
    WORKFLOW: (id) => ["workflow", id],
    WORKFLOW_NODES: (id) => ["workflow", id, "nodes"],
};

// Custom Hooks for Workflow API calls

// Fetch all workflows
export const useWorkflows = (params = { size: 1000, page: 0 }) => {
    console.log(getAuthHeaders(), "<--- Auth Headers in useWorkflows");
    return useQuery({
        queryKey: [...QUERY_KEYS.WORKFLOWS, params],
        queryFn: async () => {
            const response = await axios.get(ENDPOINTS.WORKFLOW_LIST, {
                params,
                headers: getAuthHeaders(),
            });
            return response.data;
        },
    });
};

// Fetch single workflow by ID
export const useWorkflow = (id, enabled = true) => {
    return useQuery({
        queryKey: QUERY_KEYS.WORKFLOW(id),
        queryFn: async () => {
            const response = await axios.get(ENDPOINTS.WORKFLOW_BY_ID(id), {
                headers: getAuthHeaders(),
            });
            return response.data;
        },
        enabled: !!id && enabled,
    });
};

// Create workflow mutation
export const useCreateWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (workflowData) => {
            const response = await axios.post(
                ENDPOINTS.WORKFLOW_CREATE,
                workflowData,
                {
                    headers: getAuthHeaders(),
                }
            );
            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch workflows list
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WORKFLOWS });
        },
    });
};

// Update workflow mutation
export const useUpdateWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, workflowData }) => {
            const response = await axios.put(
                ENDPOINTS.WORKFLOW_UPDATE(id),
                workflowData,
                {
                    headers: getAuthHeaders(),
                }
            );
            return response.data;
        },
        onSuccess: (data, variables) => {
            // Invalidate and refetch specific workflow and workflows list
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.WORKFLOW(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WORKFLOWS });
        },
    });
};

// Delete workflow mutation
export const useDeleteWorkflow = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id) => {
            const response = await axios.delete(
                ENDPOINTS.WORKFLOW_DELETE_BY_ID(id),
                {
                    headers: getAuthHeaders(),
                }
            );
            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch workflows list
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WORKFLOWS });
        },
    });
};

// Execute workflow mutation
export const useExecuteWorkflow = () => {
    return useMutation({
        mutationFn: async (id) => {
            const response = await axios.post(
                ENDPOINTS.WORKFLOW_EXECUTE_BY_ID(id),
                {},
                {
                    headers: getAuthHeaders(),
                }
            );
            return response.data;
        },
    });
};

// Execute single node mutation
export const useExecuteSingleNode = () => {
    return useMutation({
        mutationFn: async ({ workflowId, nodeId }) => {
            const response = await axios.post(
                ENDPOINTS.WORKFLOW_SINGLE_NODE_EXECUTE_BY_ID(
                    workflowId,
                    nodeId
                ),
                {},
                {
                    headers: getAuthHeaders(),
                }
            );
            return response.data;
        },
    });
};
