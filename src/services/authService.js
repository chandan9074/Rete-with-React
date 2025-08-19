import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AUTH_LOGIN, AUTH_LOGOUT } from "../constants/ApiUrl";

// Helper function to get access token
export const getAccessToken = () => {
    try {
        const tokenData = localStorage.getItem("authToken");
        if (!tokenData) return null;

        const tokens = JSON.parse(tokenData);
        return tokens.access;
    } catch (error) {
        console.error("Error getting access token:", error);
        return null;
    }
};

// Helper function to get refresh token
export const getRefreshToken = () => {
    try {
        const tokenData = localStorage.getItem("authToken");
        if (!tokenData) return null;

        const tokens = JSON.parse(tokenData);
        return tokens.refresh;
    } catch (error) {
        console.error("Error getting refresh token:", error);
        return null;
    }
};

// Auth API functions
const authAPI = {
    login: async (credentials) => {
        try {
            const response = await axios.post(AUTH_LOGIN, credentials, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return response.data;
        } catch (error) {
            // Handle axios error response
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Login failed";
            throw new Error(errorMessage);
        }
    },

    logout: async () => {
        const tokenData = localStorage.getItem("authToken");
        if (!tokenData) return;

        try {
            const tokens = JSON.parse(tokenData);
            const accessToken = tokens.access;

            await axios.post(
                AUTH_LOGOUT,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (error) {
            console.error("Logout API error:", error);
        }
    },
};

// Custom hooks for authentication
export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authAPI.login,
        onSuccess: (data) => {
            const { token, user } = data;

            console.log(data, "<--- Login Data");

            // Store authentication data - token is an object with access and refresh
            localStorage.setItem("authToken", JSON.stringify(token));
            localStorage.setItem("userData", JSON.stringify(user));

            // Invalidate and refetch any cached data that depends on auth
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError: (error) => {
            console.error("Login error:", error);
            // Clear any existing auth data on login failure
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authAPI.logout,
        onSuccess: () => {
            // Clear authentication data
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");

            // Clear all cached data
            queryClient.clear();
        },
        onError: (error) => {
            console.error("Logout error:", error);
            // Still clear local data even if API call fails
            localStorage.removeItem("authToken");
            localStorage.removeItem("userData");
            queryClient.clear();
        },
    });
};
