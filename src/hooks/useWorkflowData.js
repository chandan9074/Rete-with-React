import { useEffect, useRef } from "react";

export const useWorkflowData = (
    workflowData,
    editor,
    editorReady,
    setNodeList
) => {
    const loadedWorkflowRef = useRef(null);

    // Function to update only node statuses without recreating nodes
    const updateNodeStatuses = async (updatedNodes) => {
        try {
            console.log("Updating node statuses:", updatedNodes);

            if (!updatedNodes || !Array.isArray(updatedNodes)) return;

            // Update nodeList state with new statuses
            setNodeList((prev) => ({
                ...prev,
                data: prev.data.map((node) => {
                    const updatedNode = updatedNodes.find(
                        (n) => n.frontendId === node.id
                    );
                    if (updatedNode) {
                        return {
                            ...node,
                            status: updatedNode.status,
                            executionResult: updatedNode.executionResult,
                            updatedAt: updatedNode.updatedAt,
                        };
                    }
                    return node;
                }),
            }));

            // Use the editor's updateNodeStatus function for better re-rendering
            if (editor.updateNodeStatus) {
                for (const updatedNode of updatedNodes) {
                    await editor.updateNodeStatus(
                        updatedNode.frontendId,
                        updatedNode.status,
                        updatedNode.executionResult
                    );
                }
            } else {
                // Fallback to manual update if function not available
                const editorNodes = editor.getNodes();
                for (const nodeId of editorNodes) {
                    const updatedNode = updatedNodes.find(
                        (n) => n.frontendId === nodeId
                    );
                    if (updatedNode) {
                        const node = editor.getNode(nodeId);
                        if (node) {
                            node.status = updatedNode.status;
                            node.executionResult = updatedNode.executionResult;
                            if (editor.area) {
                                await editor.area.update("node", nodeId);
                            }
                        }
                    }
                }
            }

            console.log("Node statuses updated successfully");
        } catch (error) {
            console.error("Error updating node statuses:", error);
        }
    };

    useEffect(() => {
        console.log("useWorkflowData effect triggered:", {
            hasWorkflowData: !!workflowData,
            workflowId: workflowData?.id,
            hasEditor: !!editor,
            editorReady,
            currentLoadedWorkflow: loadedWorkflowRef.current?.id,
            workflowUpdatedAt: workflowData?.updatedAt,
        });

        if (!workflowData || !editor || !editorReady) {
            return;
        }

        // Check if this is the same workflow data we've already loaded
        // Compare both ID and a hash/timestamp to detect updates
        const workflowHash = JSON.stringify({
            id: workflowData.id,
            nodes: workflowData.nodes?.map((n) => ({
                id: n.frontendId,
                status: n.status,
                updatedAt: n.updatedAt,
            })),
            updatedAt: workflowData.updatedAt,
        });

        if (loadedWorkflowRef.current?.hash === workflowHash) {
            console.log("Same workflow data already loaded, skipping");
            return;
        }

        // Check if this is just a status update (same nodes, different statuses)
        const isStatusUpdate =
            loadedWorkflowRef.current?.id === workflowData.id &&
            loadedWorkflowRef.current?.hash !== workflowHash;

        if (isStatusUpdate) {
            console.log("Detected status update, updating node statuses only");
            updateNodeStatuses(workflowData.nodes);
            loadedWorkflowRef.current.hash = workflowHash;
            return;
        }

        const loadWorkflowData = async () => {
            try {
                console.log("Starting to load workflow data:", workflowData);

                // Update the loaded workflow reference
                loadedWorkflowRef.current = {
                    id: workflowData.id,
                    hash: workflowHash,
                };

                const { nodes: newNodes, connections: newConnections } =
                    workflowData;

                // Clear existing nodes first
                const existingNodes = editor.getNodes();
                console.log("Clearing existing nodes:", existingNodes.length);

                for (const node of existingNodes) {
                    await editor.deleteNode(node.id);
                }

                // Clear the node list state completely
                setNodeList({ data: [] });

                // Wait a bit for cleanup to complete
                await new Promise((resolve) => setTimeout(resolve, 50));

                // Add new nodes - let the editor handle nodeList updates
                const nodeMap = {};
                console.log("Adding new nodes:", newNodes?.length || 0);

                if (newNodes && newNodes.length > 0) {
                    for (const newNode of newNodes) {
                        const nodeConfig = {
                            ...newNode,
                            id: newNode.frontendId,
                            // Include status information for visual updates
                            status: newNode.status,
                            executionResult: newNode.executionResult,
                        };
                        console.log("Adding node with status:", nodeConfig);
                        const addedNode = await editor.addNode(nodeConfig);
                        nodeMap[newNode.frontendId] = addedNode;
                    }
                }

                // Add connections with a small delay
                if (newConnections && newConnections.length > 0) {
                    console.log("Adding connections:", newConnections.length);

                    // Wait a bit for nodes to be fully rendered
                    await new Promise((resolve) => setTimeout(resolve, 200));

                    for (const connection of newConnections) {
                        const sourceNode =
                            nodeMap[connection.sourceNodeFrontendId];
                        const targetNode =
                            nodeMap[connection.targetNodeFrontendId];

                        if (sourceNode && targetNode) {
                            console.log("Adding connection:", connection);
                            await editor.addConnection({
                                source: connection.sourceNodeFrontendId,
                                sourceOutput: connection.sourceOutput,
                                target: connection.targetNodeFrontendId,
                                targetInput: connection.targetInput,
                            });
                        } else {
                            console.warn(
                                "Missing nodes for connection:",
                                connection
                            );
                        }
                    }
                }

                console.log(
                    "Workflow data loaded successfully with updated statuses"
                );
            } catch (error) {
                console.error("Error loading workflow data:", error);
                loadedWorkflowRef.current = null; // Reset on error
            }
        };

        loadWorkflowData();
    }, [workflowData, editor, editorReady, setNodeList]);
};
