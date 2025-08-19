import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import providers from "./helpers/ProviderInjections.js";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const getAppWithContextProviders = () => {
    let result = <App />;
    providers.forEach((Provider) => (result = <Provider>{result}</Provider>));

    return result;
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 10, // 10 minutes
            retry: 3,
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <Router>{getAppWithContextProviders()}</Router>
        </QueryClientProvider>
    </StrictMode>
);
