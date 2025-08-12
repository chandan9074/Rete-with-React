import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import Canvas from "./workflow/Canvas";
import WorkflowList from "./pages/WorkflowList";
import { ConfigProvider } from "antd";

export default function App() {
    return (
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
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to={"/workflow-list"} />}
                    />
                    <Route path="/workflow" element={<Canvas />} />
                    <Route path="/workflow-list" element={<WorkflowList />} />
                </Routes>
            </div>
        </ConfigProvider>
    );
}
