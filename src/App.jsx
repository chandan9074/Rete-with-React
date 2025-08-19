import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider } from "antd";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AuthProvider>
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: "#2D2E2E",
                                fontFamily: " 'Poppins', sans-serif",
                                // colorTextBase: BLUE_TWO,
                                colorTextBase: "#f4f4f4",
                                fontSize: 14,
                            },
                            components: {
                                Dropdown: {
                                    colorBgElevated: "#2b2a25",
                                },
                                Table: {
                                    colorBgContainer: "#3c3c3c",
                                    borderColor: "#2b2a25",
                                },
                                Pagination: {
                                    itemActiveBg: "#EF4E39",
                                    itemBg: "#3c3c3c",
                                    colorText: "#f4f4f4",
                                },
                                Modal: {
                                    contentBg: "#2D2E2E",
                                },
                            },
                        }}
                    >
                        <div className="App">
                            <AppRoutes />
                        </div>
                    </ConfigProvider>
                </AuthProvider>
            </Router>
        </QueryClientProvider>
    );
}
