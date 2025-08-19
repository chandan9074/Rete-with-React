// WorkflowList.jsx
import React, { useState } from "react";
import { message, Table, Spin, Button } from "antd";
import { MdDelete, MdEdit, MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useWorkflows, useDeleteWorkflow } from "../services/workflowService";
import Navbar from "../components/Navbar";
import CreateModal from "./CreateModal.jsx";

const WorkflowList = () => {
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const navigate = useNavigate();

    // React Query hooks for workflow data
    const {
        data: workflowData,
        isLoading,
        isError,
        error,
        refetch,
    } = useWorkflows({ size: 1000, page: 0 });

    const deleteWorkflowMutation = useDeleteWorkflow();

    // Extract workflow list from the response
    const workflowList = workflowData?.content || [];

    const handleDeleteWorkflow = async (id) => {
        try {
            await deleteWorkflowMutation.mutateAsync(id);
            message.success("Workflow deleted successfully");
        } catch (error) {
            message.error(error.message || "Failed to delete workflow");
        }
    };

    // Handle loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#2D2E2E]">
                <Spin size="large" />
            </div>
        );
    }

    // Handle error state
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[#2D2E2E]">
                <div className="text-red-400 text-lg mb-4">
                    Error loading workflows: {error?.message}
                </div>
                <Button onClick={() => refetch()} type="primary">
                    Retry
                </Button>
            </div>
        );
    }

    // Define table columns
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            ellipsis: true,
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 200,
            render: (timestamp) => {
                if (!timestamp) return "-";

                try {
                    // Convert timestamp to Date object
                    const date = new Date(parseInt(timestamp));

                    // Check if date is valid
                    if (isNaN(date.getTime())) {
                        return "Invalid Date";
                    }

                    return date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                } catch (error) {
                    console.error("Error formatting date:", error);
                    return "Invalid Date";
                }
            },
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            width: 120,
            render: (_, data) => (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(`/workflow?id=${data.id}`)}
                        className="bg-[#EF4E39] hover:bg-[#FF6F5C] transition-colors duration-200 p-2 rounded-md cursor-pointer"
                        title="Edit Workflow"
                    >
                        <MdEdit className="text-white text-base" />
                    </button>
                    <button
                        onClick={() => handleDeleteWorkflow(data.id)}
                        disabled={deleteWorkflowMutation.isPending}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 p-2 rounded-md cursor-pointer"
                        title="Delete Workflow"
                    >
                        <MdDelete className="text-white text-base" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-[#2D2E2E]">
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <div className="p-6 md:p-16">
                {/* Header Section */}
                <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-gray-200 text-2xl font-semibold mb-2">
                            Workflow List
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Manage and organize your workflows
                        </p>
                    </div>

                    {/* Create Workflow Button */}
                    <button
                        onClick={() => setOpenCreateModal(true)}
                        className="bg-[#FF6F5C] hover:bg-[#EF4E39] transition-colors duration-300 py-2.5 px-5 rounded-md items-center gap-2 flex cursor-pointer"
                    >
                        <MdAdd className="text-gray-200 text-lg" />
                        <span className="text-gray-200 text-sm font-semibold whitespace-nowrap">
                            Create Workflow
                        </span>
                    </button>
                </div>

                <div className="bg-[#3c3c3c] rounded-lg overflow-hidden">
                    <style jsx>{`
                        .ant-pagination {
                            padding-right: 16px !important;
                        }
                        .ant-pagination
                            .ant-select:not(.ant-select-customize-input)
                            .ant-select-selector {
                            background-color: #2d2e2e !important;
                            border-color: #2b2a25 !important;
                            color: #f4f4f4 !important;
                        }
                        .ant-pagination .ant-select-dropdown {
                            background-color: #2d2e2e !important;
                            border-color: #2b2a25 !important;
                        }
                        .ant-pagination .ant-select-item {
                            background-color: #2d2e2e !important;
                            color: #f4f4f4 !important;
                        }
                        .ant-pagination .ant-select-item:hover {
                            background-color: #3c3c3c !important;
                        }
                        .ant-pagination .ant-select-item-option-selected {
                            background-color: #ef4e39 !important;
                            color: #f4f4f4 !important;
                        }
                        .ant-pagination .ant-input {
                            background-color: #2d2e2e !important;
                            border-color: #2b2a25 !important;
                            color: #f4f4f4 !important;
                        }
                        .ant-pagination .ant-input:focus,
                        .ant-pagination .ant-input-focused {
                            border-color: #ef4e39 !important;
                            box-shadow: 0 0 0 2px rgba(239, 78, 57, 0.2) !important;
                        }
                    `}</style>
                    <Table
                        columns={columns}
                        dataSource={workflowList}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) =>
                                `${range[0]}-${range[1]} of ${total} workflows`,
                            className: "dark-pagination",
                        }}
                        loading={deleteWorkflowMutation.isPending}
                        locale={{
                            emptyText: (
                                <div className="py-8">
                                    <div className="text-gray-400 text-lg mb-2">
                                        No workflows found
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        Create your first workflow to get
                                        started
                                    </div>
                                </div>
                            ),
                        }}
                    />
                </div>

                <CreateModal
                    openCreateModal={openCreateModal}
                    setOpenCreateModal={setOpenCreateModal}
                />
            </div>
        </div>
    );
};

export default WorkflowList;
