import { ConfigProvider, Drawer } from "antd";
import React, { useEffect } from "react";
import HttpRequestForm from "./NodeForm/HttpRequestForm";
import ScheduleTriggerForm from "./NodeForm/ScheduleTriggerForm";
import { useCommon } from "../context/CommonContextProvider";

const FormDrawer = ({
    openFormDrawer,
    handleFormDrawerClose,
    selectedNode,
}) => {
    // const { openFormDrawer } = useCommon();

    // Map slug values to corresponding components
    const componentMap = {
        httpRequest: HttpRequestForm,
        onASchedule: ScheduleTriggerForm,
    };

    useEffect(() => {
        console.log(openFormDrawer, "openFormDrawer in FormDrawer");
    }, [openFormDrawer]);

    // Select the component based on the slug
    const SelectedComponent =
        componentMap[selectedNode?.slug] || (() => <div></div>);

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
                    Select: {
                        /* here is your component tokens */
                        colorBgContainer: "#2D2E2E",
                        activeBorderColor: "#5b5c5c",
                        hoverBorderColor: "#5b5c5c",
                        activeOutlineColor: "#5b5c5c",
                        colorBorder: "#5b5c5c",
                        colorText: "#f4f4f4",
                        colorTextPlaceholder: "#9a9a9b",
                        selectorBg: "#2D2E2E",
                    },
                    Input: {
                        colorTextPlaceholder: "#9a9a9b",
                    },
                },
            }}
        >
            <Drawer
                width="520"
                closable={false}
                onClose={handleFormDrawerClose}
                open={openFormDrawer}
            >
                <div className="w-full h-screen overflow-auto bg-[#414244]">
                    <SelectedComponent data={selectedNode} />
                </div>
            </Drawer>
        </ConfigProvider>
    );
};

export default FormDrawer;
