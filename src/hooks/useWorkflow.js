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
    const [activePollingIntervals, setActivePollingIntervals] = useState(
        new Set()
    );

    // React Query hooks
    const { data: workflowData, isLoading, refetch } = useWorkflow(id);
    const createWorkflowMutation = useCreateWorkflow();
    const updateWorkflowMutation = useUpdateWorkflow();
    const executeWorkflowMutation = useExecuteWorkflow();
    const executeSingleNodeMutation = useExecuteSingleNode();

    // Cleanup intervals on component unmount
    useEffect(() => {
        return () => {
            activePollingIntervals.forEach((interval) => {
                if (interval) clearInterval(interval);
            });
            setActivePollingIntervals(new Set());
        };
    }, []); // Empty dependency array - only run on mount/unmount

    // Helper function to manage polling intervals
    const createPollingInterval = () => {
        const interval = setInterval(async () => {
            try {
                await refetch();
            } catch (pollingError) {
                console.warn("Polling refetch failed:", pollingError);
            }
        }, 1000);

        setActivePollingIntervals((prev) => new Set([...prev, interval]));
        return interval;
    };

    const clearPollingInterval = (interval) => {
        if (interval) {
            clearInterval(interval);
            setActivePollingIntervals((prev) => {
                const newSet = new Set(prev);
                newSet.delete(interval);
                return newSet;
            });
        }
    };

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

        let pollingInterval = null;

        try {
            // Start polling to refetch workflow data every 1 second
            pollingInterval = createPollingInterval();

            const result = await executeWorkflowMutation.mutateAsync(id);
            message.success("Workflow executed successfully");

            // Clear the polling interval when execution completes
            clearPollingInterval(pollingInterval);

            // Final refetch after execution completion
            await refetch();
            return result;
        } catch (error) {
            // Clear the polling interval on error
            clearPollingInterval(pollingInterval);

            message.error("Failed to execute workflow");
            // Refetch to get any partial execution results
            await refetch();
            throw error;
        }
    };

    const handleExecuteSingleNode = async (nodeId, frontendId) => {
        if (!id) return;

        let pollingInterval = null;

        try {
            message.loading("Executing node...");

            // Start polling to refetch workflow data every 1 second
            pollingInterval = createPollingInterval();

            const result = await executeSingleNodeMutation.mutateAsync({
                workflowId: id,
                nodeId,
            });

            // Clear the polling interval when execution completes
            clearPollingInterval(pollingInterval);

            message.success("Node executed successfully");
            // Final refetch after execution completion
            await refetch();
            return { result, frontendId };
        } catch (error) {
            // Clear the polling interval on error
            clearPollingInterval(pollingInterval);

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
