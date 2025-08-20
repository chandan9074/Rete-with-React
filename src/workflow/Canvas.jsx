import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiPlusSm } from "react-icons/hi";
import { BsHourglassSplit } from "react-icons/bs";
import { LuArrowLeft } from "react-icons/lu";

import { useCommon } from "../context/CommonContextProvider";
import { useWorkflowOperations } from "../hooks/useWorkflow";
import { useNodeManagement } from "../hooks/useNodeManagement";
import { useEditor } from "../hooks/useEditor";
import { useWorkflowData } from "../hooks/useWorkflowData";

import SideDrawer from "../components/SideDrawer";
import FormDrawer from "../components/FormDrawer";
import RenameModal from "../components/RenameModal";

export default function Canvas() {
    // URL and navigation
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");

    // Context
    const { openFormDrawer, setOpenFormDrawer, selectedNode, setSelectedNode } =
        useCommon();

    // Local state
    const [open, setOpen] = useState(false);
    const [updateAsJson, setUpdateAdJson] = useState(false);
    const [openRenameModal, setOpenRenameModal] = useState(null);

    // Custom hooks
    const {
        workflowData,
        isLoading,
        handleCreate,
        handleUpdate,
        handleExecute,
        handleExecuteSingleNode,
        isCreating,
        isUpdating,
        isExecuting,
        isExecutingSingleNode,
    } = useWorkflowOperations(id);

    const {
        nodeList,
        setNodeList,
        nodeInputOutputs,
        setNodeInputsOutputs,
        isDuplicateNode,
        setIsDuplicateNode,
        addNode,
        updateNodeInputsOutputs,
        handleRename,
        handleUpdateNodeData,
        handleDuplicateNodeUpdate,
    } = useNodeManagement();

    const { editorContainerRef, editor, editorReady } = useEditor(
        nodeList,
        setNodeList,
        openFormDrawer,
        setOpenFormDrawer,
        selectedNode,
        setSelectedNode,
        handleExecute,
        updateAsJson,
        setUpdateAdJson,
        openRenameModal,
        setOpenRenameModal,
        handleDuplicateNodeUpdate
    );

    // Load workflow data when it changes
    useWorkflowData(workflowData, editor, editorReady, setNodeList);

    // Add initial trigger node for new workflows
    useEffect(() => {
        if (!id && editorReady && editor && nodeList.data.length === 0) {
            const initialNode = {
                label: "When clicking 'Execute Workflow'",
                id: `node${Date.now()}`,
                x: 100,
                y: 100,
                inputs: ["a"],
                outputs: ["a"],
                slug: "triggerManually",
            };

            editor.addNode(initialNode);
            setNodeList({ data: [initialNode] });
        }
    }, [id, editorReady, editor, nodeList.data.length, setNodeList]);

    // Event handlers
    const handleAddNode = (item) => {
        const newNode = addNode(item, editor);
        setSelectedNode(newNode);
        setOpenFormDrawer(true);
        setOpen(false);
    };

    const handleFormDrawerClose = () => {
        setOpenFormDrawer(false);
        setSelectedNode(null);
        setUpdateAdJson(false);
    };

    const handleUpdateWorkflowJsonDrawer = () => {
        setOpenFormDrawer(true);
        setSelectedNode({ slug: "workflowJsonUpdate" });
        setUpdateAdJson(true);
    };

    const onSingleNodeExecution = async (nodeId, frontendId) => {
        try {
            const result = await handleExecuteSingleNode(nodeId, frontendId);
            if (result) {
                updateNodeInputsOutputs(result);
            }
        } catch (error) {
            console.error("Error in single node execution:", error);
        }
    };

    const onRenameNode = (nodeId, name) => {
        handleRename(nodeId, name, editor);
    };

    const onUpdateNodeData = (nodeId, newData) => {
        handleUpdateNodeData(nodeId, newData, editor);
    };

    // Handle duplicate node effect
    useEffect(() => {
        if (isDuplicateNode) {
            const filteredNode = nodeList.data.find(
                (node) => node.id === isDuplicateNode.id
            );
            const duplicateNodeData = {
                ...isDuplicateNode.duplicateNodeData,
                ...(filteredNode?.formData && {
                    formData: filteredNode.formData,
                }),
            };

            setNodeList((prev) => ({
                ...prev,
                data: [...prev.data, duplicateNodeData],
            }));
            setIsDuplicateNode(null);
        }
    }, [isDuplicateNode, nodeList.data, setNodeList, setIsDuplicateNode]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#2D2E2E]">
                <div className="text-gray-200 text-xl">Loading workflow...</div>
            </div>
        );
    }

    return (
        <div className="App">
            {/* Header */}
            <div className="absolute top-5 left-10 flex items-center gap-6 z-10">
                <button
                    onClick={() => navigate("/workflow-list")}
                    className="bg-gray-200 p-2 rounded-md cursor-pointer"
                >
                    <LuArrowLeft className="text-[#2D2E2E] text-xl" />
                </button>
                {workflowData && (
                    <p className="text-3xl text-gray-200 font-bold">
                        {workflowData.name}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-5 right-10 flex items-center gap-3 z-10">
                {id ? (
                    <>
                        <button
                            onClick={handleUpdateWorkflowJsonDrawer}
                            className="bg-[#FF6F5C] hover:bg-[#EF4E39] duration-300 py-2.5 px-5 rounded-md items-center gap-2 flex cursor-pointer"
                        >
                            <span className="text-gray-200 text-sm font-semibold whitespace-nowrap">
                                Update Workflow JSON
                            </span>
                        </button>
                        <button
                            onClick={handleExecute}
                            disabled={isExecuting}
                            className="bg-[#FF6F5C] hover:bg-[#EF4E39] duration-300 py-2.5 px-5 rounded-md items-center gap-2 flex cursor-pointer disabled:opacity-50"
                        >
                            <BsHourglassSplit className="text-gray-200" />
                            <span className="text-gray-200 text-sm font-semibold whitespace-nowrap">
                                {isExecuting
                                    ? "Executing..."
                                    : "Execute Workflow"}
                            </span>
                        </button>
                        <button
                            onClick={() => handleUpdate(nodeList, editor)}
                            disabled={isUpdating}
                            className="bg-[#FF6F5C] hover:bg-[#EF4E39] duration-300 py-2.5 px-5 rounded-md items-center gap-2 flex cursor-pointer disabled:opacity-50"
                        >
                            <span className="text-gray-200 text-sm font-semibold whitespace-nowrap">
                                {isUpdating ? "Updating..." : "Update"}
                            </span>
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => handleCreate(nodeList, editor)}
                        disabled={isCreating}
                        className="bg-[#FF6F5C] hover:bg-[#EF4E39] duration-300 py-2.5 px-5 rounded-md items-center gap-2 flex cursor-pointer disabled:opacity-50"
                    >
                        <span className="text-gray-200 text-sm font-semibold whitespace-nowrap">
                            {isCreating ? "Creating..." : "Create"}
                        </span>
                    </button>
                )}
                <button
                    onClick={() => setOpen(true)}
                    className="p-1 border border-gray-300 rounded-md cursor-pointer"
                >
                    <HiPlusSm className="text-4xl text-gray-300" />
                </button>
            </div>

            {/* Drawers and Modals */}
            <SideDrawer
                open={open}
                setOpen={setOpen}
                handleSubmit={handleAddNode}
            />

            <FormDrawer
                openFormDrawer={openFormDrawer}
                handleFormDrawerClose={handleFormDrawerClose}
                selectedNode={selectedNode}
                setNodeList={setNodeList}
                nodeList={nodeList}
                handleSubmit={() => {}} // Legacy prop, can be removed
                setUpdateAdJson={setUpdateAdJson}
                updateAsJson={updateAsJson}
                handleUpdateWorkflow={(updatedNodeList) =>
                    handleUpdate(nodeList, editor, updatedNodeList)
                }
                handleUpdateNodeData={onUpdateNodeData}
                handleSingleNodeExecution={onSingleNodeExecution}
                nodeInputOutputs={nodeInputOutputs}
                executeLoading={isExecutingSingleNode}
            />

            <RenameModal
                nodeList={nodeList}
                setNodeList={setNodeList}
                openRenameModal={openRenameModal}
                setOpenRenameModal={setOpenRenameModal}
                handleRenameNode={onRenameNode}
            />

            {/* Editor Container */}
            <div
                ref={editorContainerRef}
                className="bg-[#2D2E2E]"
                style={{ height: "100vh", width: "100vw" }}
            />
        </div>
    );
}
