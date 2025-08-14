import { ConfigProvider, Drawer } from "antd";
import React, { useEffect } from "react";
import HttpRequestForm from "./NodeForm/HttpRequestForm";
import ScheduleTriggerForm from "./NodeForm/ScheduleTriggerForm";
import { useCommon } from "../context/CommonContextProvider";
import EditFieldsForm from "./NodeForm/EditFieldsForm";
import SendAMessageForm from "./NodeForm/SendAMessageForm";
import HttpRequestJSONForm from "./NodeForm/HttpRequestJSONForm";
import WorkflowJsonForm from "./NodeForm/WorkflowJsonForm";

const FormDrawer = ({
    openFormDrawer,
    handleFormDrawerClose,
    selectedNode,
    setNodeList,
    nodeList,
    handleSubmit,
    handleUpdateWorkflow,
    handleSingleNodeExecution,
    setUpdateAdJson,
    updateAsJson,
    nodeInputOutputs,
    executeLoading,
}) => {
    // const { openFormDrawer } = useCommon();

    console.log(nodeList, "nodeList in FormDrawer");

    // Map slug values to corresponding components
    const componentMap = {
        httpRequest: updateAsJson ? HttpRequestJSONForm : HttpRequestForm,
        onASchedule: ScheduleTriggerForm,
        editFields: EditFieldsForm,
        sendAMessage: SendAMessageForm,
        workflowJsonUpdate: WorkflowJsonForm,
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
                width={`${
                    selectedNode?.slug === "triggerManually"
                        ? "420px"
                        : updateAsJson
                        ? "50%"
                        : "90%"
                }`}
                closable={false}
                onClose={handleFormDrawerClose}
                open={openFormDrawer}
            >
                <div className="w-full h-screen overflow-auto bg-[#414244]">
                    <SelectedComponent
                        data={selectedNode}
                        setNodeList={setNodeList}
                        nodeList={nodeList}
                        handleSubmit={handleSubmit}
                        handleFormDrawerClose={handleFormDrawerClose}
                        handleUpdateWorkflow={handleUpdateWorkflow}
                        handleSingleNodeExecution={handleSingleNodeExecution}
                        nodeInputOutputs={nodeInputOutputs}
                        executeLoading={executeLoading}
                    />
                </div>
            </Drawer>
        </ConfigProvider>
    );
};

export default FormDrawer;
