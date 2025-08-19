import { useEffect, useRef } from "react";

export const useWorkflowData = (
    workflowData,
    editor,
    editorReady,
    setNodeList
) => {
    const loadedWorkflowId = useRef(null);

    useEffect(() => {
        console.log("useWorkflowData effect triggered:", {
            hasWorkflowData: !!workflowData,
            workflowId: workflowData?.id,
            hasEditor: !!editor,
            editorReady,
            loadedWorkflowId: loadedWorkflowId.current,
        });

        if (!workflowData || !editor || !editorReady) {
            return;
        }

        // Prevent loading the same workflow multiple times
        if (loadedWorkflowId.current === workflowData.id) {
            console.log("Workflow already loaded, skipping");
            return;
        }

        const loadWorkflowData = async () => {
            try {
                console.log("Starting to load workflow data:", workflowData);
                loadedWorkflowId.current = workflowData.id;

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
                        };
                        console.log("Adding node:", nodeConfig);
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

                console.log("Workflow data loaded successfully");
            } catch (error) {
                console.error("Error loading workflow data:", error);
                loadedWorkflowId.current = null; // Reset on error
            }
        };

        loadWorkflowData();
    }, [workflowData, editor, editorReady, setNodeList]);
};
