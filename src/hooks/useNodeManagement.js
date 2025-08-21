import { useState, useCallback } from "react";

export const useNodeManagement = () => {
    const [nodeList, setNodeList] = useState({
        data: [],
    });

    const [nodeInputOutputs, setNodeInputsOutputs] = useState([]);
    const [isDuplicateNode, setIsDuplicateNode] = useState(null);

    const addNode = useCallback((item, editor) => {
        const newNode = {
            label: item.label,
            id: `node${Date.now()}`,
            x: Math.random() * 500,
            y: Math.random() * 500,
            inputs: ["a"],
            outputs: ["a"],
            slug: item.slug,
        };

        if (editor?.addNode) {
            editor.addNode(newNode);
        }

        return newNode;
    }, []);

    const updateNodeInputsOutputs = useCallback(
        (nodeExecutionResult, editor = null) => {
            const { result, frontendId } = nodeExecutionResult;
            const { response } = result;

            setNodeInputsOutputs((prev) => {
                const updatedState = [...prev];

                // Update or add node output
                const existingNode = updatedState.find(
                    (node) => node.id === frontendId
                );
                if (existingNode) {
                    existingNode.output = response;
                } else {
                    updatedState.push({
                        id: frontendId,
                        output: response,
                        input: {},
                    });
                }

                // If editor is available, find connected nodes and update their inputs
                if (editor && editor.getConnections) {
                    const connections = editor.getConnections();

                    // Find connections where the executed node is the source
                    const outgoingConnections = connections.filter(
                        (connection) => connection.source === frontendId
                    );

                    console.log("Updating connected node inputs:", {
                        sourceNodeId: frontendId,
                        outgoingConnections,
                        response,
                    });

                    // Update inputs of connected target nodes
                    outgoingConnections.forEach((connection) => {
                        const targetNodeId = connection.target;
                        const targetInputKey = connection.targetInput;

                        // Find or create target node in the state
                        let targetNode = updatedState.find(
                            (node) => node.id === targetNodeId
                        );
                        if (!targetNode) {
                            targetNode = {
                                id: targetNodeId,
                                output: {},
                                input: {},
                            };
                            updatedState.push(targetNode);
                        }

                        // Update the specific input of the target node
                        if (!targetNode.input) {
                            targetNode.input = {};
                        }
                        targetNode.input[targetInputKey] = response;

                        console.log(`Updated input for node ${targetNodeId}:`, {
                            inputKey: targetInputKey,
                            inputData: response,
                        });
                    });
                }

                return updatedState;
            });
        },
        []
    );

    const handleRename = useCallback((nodeId, name, editor) => {
        if (editor?.renameNode) {
            editor.renameNode(nodeId, name);
            setNodeList((prev) => {
                const updatedList = prev.data.map((node) =>
                    node.id === nodeId ? { ...node, label: name } : node
                );
                return { ...prev, data: updatedList };
            });
        }
    }, []);

    const handleUpdateNodeData = useCallback((nodeId, newData, editor) => {
        if (editor?.updateNodeData) {
            editor.updateNodeData(nodeId, newData);
            setNodeList((prev) => {
                const updatedList = prev.data.map((node) =>
                    node.id === nodeId ? { ...node, ...newData } : node
                );
                return { ...prev, data: updatedList };
            });
        }
    }, []);

    const handleDuplicateNodeUpdate = useCallback((id, duplicateNodeData) => {
        setIsDuplicateNode({ id, duplicateNodeData });
    }, []);

    return {
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
    };
};
