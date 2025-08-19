import { useState, useEffect } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import {
    useWorkflow,
    useCreateWorkflow,
    useUpdateWorkflow,
    useExecuteWorkflow,
    useExecuteSingleNode,
} from "../services/workflowService";

export const useWorkflowOperations = (id) => {
    const navigate = useNavigate();

    // React Query hooks
    const { data: workflowData, isLoading, refetch } = useWorkflow(id);
    const createWorkflowMutation = useCreateWorkflow();
    const updateWorkflowMutation = useUpdateWorkflow();
    const executeWorkflowMutation = useExecuteWorkflow();
    const executeSingleNodeMutation = useExecuteSingleNode();

    const handleCreate = async (nodeList, editor) => {
        if (!editor) return;

        const connections = editor.getConnections().map((connection) => ({
            sourceNodeFrontendId: connection.source,
            sourceOutput: connection.sourceOutput,
            targetNodeFrontendId: connection.target,
            targetInput: connection.targetInput,
        }));

        const data = {
            name: "New Workflow",
            description: "This is a new workflow",
            nodes: nodeList.data.map((node) => ({
                label: node?.label,
                frontendId: node.id,
                slug: node.slug,
                x: node.x,
                y: node.y,
                inputs: node.inputs,
                outputs: node.outputs,
                ...(node.formData && { formData: node.formData }),
            })),
            connections,
        };

        try {
            const result = await createWorkflowMutation.mutateAsync(data);
            navigate(`?id=${result.id}`);
            message.success("Workflow created successfully");
            return result;
        } catch (error) {
            message.error("Failed to create workflow");
            throw error;
        }
    };

    const handleUpdate = async (nodeList, editor, updatedNodeList = null) => {
        if (!editor || !id) return;

        const connections = editor.getConnections().map((connection) => ({
            sourceNodeFrontendId: connection.source,
            sourceOutput: connection.sourceOutput,
            targetNodeFrontendId: connection.target,
            targetInput: connection.targetInput,
        }));

        const updateNode = updatedNodeList || nodeList.data;

        const data = {
            ...workflowData,
            nodes: updateNode?.map((node) => ({
                label: node?.label,
                frontendId: node.id,
                slug: node.slug,
                x: node.x,
                y: node.y,
                inputs: node.inputs,
                outputs: node.outputs,
                ...(node.formData && { formData: node.formData }),
            })),
            connections,
        };

        try {
            const result = await updateWorkflowMutation.mutateAsync({
                id,
                workflowData: data,
            });
            message.success("Workflow updated successfully");
            await refetch();
            return result;
        } catch (error) {
            message.error("Failed to update workflow");
            throw error;
        }
    };

    const handleExecute = async () => {
        if (!id) return;

        try {
            const result = await executeWorkflowMutation.mutateAsync(id);
            message.success("Workflow executed successfully");
            await refetch();
            return result;
        } catch (error) {
            message.error("Failed to execute workflow");
            // Refetch to get any partial execution results
            await refetch();
            throw error;
        }
    };

    const handleExecuteSingleNode = async (nodeId, frontendId) => {
        if (!id) return;

        try {
            message.loading("Executing node...");
            const result = await executeSingleNodeMutation.mutateAsync({
                workflowId: id,
                nodeId,
            });
            message.success("Node executed successfully");
            await refetch();
            return { result, frontendId };
        } catch (error) {
            message.error("Failed to execute node");
            // Refetch to get any partial execution results
            await refetch();
            throw error;
        }
    };

    return {
        workflowData,
        isLoading,
        handleCreate,
        handleUpdate,
        handleExecute,
        handleExecuteSingleNode,
        isCreating: createWorkflowMutation.isPending,
        isUpdating: updateWorkflowMutation.isPending,
        isExecuting: executeWorkflowMutation.isPending,
        isExecutingSingleNode: executeSingleNodeMutation.isPending,
    };
};
