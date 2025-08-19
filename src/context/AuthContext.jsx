import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on app start
    useEffect(() => {
        const checkAuthStatus = () => {
            try {
                const token = localStorage.getItem("authToken");
                const userData = localStorage.getItem("userData");

                if (token && userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error("Error checking auth status:", error);
                localStorage.removeItem("authToken");
                localStorage.removeItem("userData");
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    // Function to set user data (called from login mutation)
    const setUserData = (userData) => {
        setUser(userData);
    };

    // Function to clear user data (called from logout mutation)
    const clearUserData = () => {
        setUser(null);
    };

    const isAuthenticated = () => {
        return !!user && !!localStorage.getItem("authToken");
    };

    const getToken = () => {
        try {
            const tokenData = localStorage.getItem("authToken");
            if (!tokenData) return null;

            const tokens = JSON.parse(tokenData);
            return tokens.access; // Return access token
        } catch (error) {
            console.error("Error getting token:", error);
            return null;
        }
    };

    const getRefreshToken = () => {
        try {
            const tokenData = localStorage.getItem("authToken");
            if (!tokenData) return null;

            const tokens = JSON.parse(tokenData);
            return tokens.refresh; // Return refresh token
        } catch (error) {
            console.error("Error getting refresh token:", error);
            return null;
        }
    };

    const value = {
        user,
        loading,
        setUserData,
        clearUserData,
        isAuthenticated,
        getToken,
        getRefreshToken,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
