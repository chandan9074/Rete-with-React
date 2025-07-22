import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import providers from "./helpers/ProviderInjections.js";
import App from "./App.jsx";

const getAppWithContextProviders = () => {
    let result = <App />;
    providers.forEach((Provider) => (result = <Provider>{result}</Provider>));

    return result;
};

createRoot(document.getElementById("root")).render(
    <StrictMode>{getAppWithContextProviders()}</StrictMode>
);
