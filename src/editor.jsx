import { createRoot } from "react-dom/client";
import { NodeEditor, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
    ConnectionPlugin,
    Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { ReactPlugin, Presets } from "rete-react-plugin";
import { CustomNode } from "./CustomNode";
import { CustomSocket } from "./CustomSocket";
import { CustomConnection } from "./CustomConnection";
import { addCustomBackground } from "./custom-background";

export async function createEditor(container) {
    const socket = new ClassicPreset.Socket("socket");

    // Initialize editor and plugins
    const editor = new NodeEditor();
    const area = new AreaPlugin(container);
    const connection = new ConnectionPlugin();
    const render = new ReactPlugin({ createRoot });

    // Mount plugins
    editor.use(area);
    area.use(connection);
    area.use(render);

    // Enable node selection
    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    // Register React preset with custom components
    render.addPreset(
        Presets.classic.setup({
            customize: {
                node(context) {
                    return (props) => (
                        <CustomNode
                            {...props}
                            deleteNode={deleteNode}
                            duplicateNode={duplicateNode}
                        />
                    );
                },
                socket() {
                    return CustomSocket;
                },
                connection() {
                    return CustomConnection;
                },
            },
        })
    );

    // Register connection preset
    connection.addPreset(ConnectionPresets.classic.setup());

    // Add background styling
    addCustomBackground(area);

    // Order nodes simply
    AreaExtensions.simpleNodesOrder(area);

    // Initialize node configs with inputs and outputs for subnodes
    let nodeConfigs = [
        {
            label: "Parent Node A",
            id: "node1",
            x: 0,
            y: 0,
            inputs: ["a"],
            outputs: ["a"],
            subnodes: [
                {
                    id: "sub1",
                    label: "Child 1",
                    inputs: ["in"], // Define input for subnode
                    outputs: ["out"], // Define output for subnode
                },
                {
                    id: "sub2",
                    label: "Child 2",
                    inputs: ["in"], // Define input for subnode
                    outputs: ["out"], // Define output for subnode
                },
            ],
        },
        {
            label: "Parent Node B",
            id: "node2",
            x: 300,
            y: 0,
            inputs: ["a"],
            outputs: ["a"],
            subnodes: [],
        },
    ];

    // Helper function to create nodes
    async function makeNode(cfg) {
        const node = new ClassicPreset.Node(cfg.label);

        // Add parent node inputs with multiple connections enabled
        cfg.inputs.forEach((key) =>
            node.addInput(key, new ClassicPreset.Input(socket, key, true))
        );

        // Add parent node outputs with multiple connections enabled
        cfg.outputs.forEach((key) =>
            node.addOutput(key, new ClassicPreset.Output(socket, key, true))
        );

        // Add subnodes with inputs and outputs supporting multiple connections
        node.data = {};
        node.data.subnodes = (cfg.subnodes || []).map((sn) => {
            const subnode = {
                ...sn,
                socket,
                inputs: {},
                outputs: {},
            };

            // Add input socket for subnode with multiple connections
            (sn.inputs || []).forEach((key) => {
                subnode.inputs[key] = new ClassicPreset.Input(
                    socket,
                    key,
                    true
                );
            });

            // Add output socket for subnode with multiple connections
            (sn.outputs || []).forEach((key) => {
                subnode.outputs[key] = new ClassicPreset.Output(
                    socket,
                    key,
                    true
                );
            });

            return subnode;
        });

        // Set the position property explicitly
        node.position = { x: cfg.x, y: cfg.y };

        await editor.addNode(node);
        await area.translate(node.id, { x: cfg.x, y: cfg.y });
        return node;
    }

    // Loop over the initial nodeConfigs and create nodes
    const created = {};
    for (let cfg of nodeConfigs) {
        created[cfg.id] = await makeNode(cfg);
    }

    // Dynamically add node function triggered by App.js
    const addNode = (newNode) => {
        nodeConfigs.push(newNode); // Add to the array
        makeNode(newNode); // Create and render the node
    };

    // Add connection validation to ensure socket compatibility
    connection.addPipe((context) => {
        if (context.type === "connectioncreate") {
            const { sourceOutput, targetInput } = context.data;
            const sourceNode = editor.getNode(context.data.source);
            const targetNode = editor.getNode(context.data.target);

            // Check parent node sockets
            let sourceSocket = sourceNode.outputs[sourceOutput]?.socket;
            let targetSocket = targetNode.inputs[targetInput]?.socket;

            // Check subnode sockets if applicable
            if (!sourceSocket) {
                sourceSocket = sourceNode.data.subnodes?.find(
                    (sn) => sn.outputs[sourceOutput]
                )?.outputs[sourceOutput]?.socket;
            }
            if (!targetSocket) {
                targetSocket = targetNode.data.subnodes?.find(
                    (sn) => sn.inputs[targetInput]
                )?.inputs[targetInput]?.socket;
            }

            // Allow connection only if sockets match
            if (sourceSocket && targetSocket && sourceSocket !== targetSocket) {
                return; // Prevent connection if sockets don't match
            }
        }
        return context;
    });

    const deleteNode = async (nodeId) => {
        // Check if the nodeId exists in the editor
        const node = editor.getNode(nodeId);

        if (!node) {
            console.error(`Node with ID ${nodeId} not found.`);
            return;
        }

        // Log connections
        const connections = editor.getConnections();

        // Remove all connections related to the node
        connections.forEach((connection) => {
            if (connection.source === nodeId || connection.target === nodeId) {
                console.log(`Removing connection:`, connection);
                editor.removeConnection(connection.id);
            }
        });

        try {
            await editor.removeNode(nodeId); // Attempt to remove the node
        } catch (error) {
            console.error(`Failed to remove node ${nodeId}:`, error);
        }
    };

    const duplicateNode = async (nodeId) => {
        // Get the original node
        const originalNode = editor.getNode(nodeId);

        if (!originalNode) {
            console.error(`Node with ID ${nodeId} not found.`);
            return;
        }

        // Clone the node properties
        console.log("Duplicating node:", originalNode);
        const newNodeConfig = {
            label: originalNode.label + " (Duplicate)", // Add "Duplicate" to the label
            id: `node_${Date.now()}`, // Generate a unique ID for the new node
            x: originalNode.position.x + 50, // Offset the position slightly
            y: originalNode.position.y + 50,
            inputs: Object.keys(originalNode.inputs), // Clone inputs
            outputs: Object.keys(originalNode.outputs), // Clone outputs
            subnodes: (originalNode.data.subnodes || []).map((sn) => ({
                ...sn,
                inputs: Object.keys(sn.inputs || {}), // Convert inputs to an array
                outputs: Object.keys(sn.outputs || {}), // Convert outputs to an array
            })),
        };

        // Create the new node
        await makeNode(newNodeConfig);
        console.log(`Node duplicated successfully: ${newNodeConfig.id}`);
    };

    // Zoom to fit
    setTimeout(() => {
        AreaExtensions.zoomAt(area, editor.getNodes());
    }, 100);

    return {
        destroy: () => area.destroy(),
        addNode, // Return the reference to addNode
        getNodes: () => editor.getNodes(),
        getConnections: () => editor.getConnections(),
        deleteNode,
    };
}
