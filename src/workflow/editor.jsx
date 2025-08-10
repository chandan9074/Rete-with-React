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
import {
    HistoryExtensions,
    HistoryPlugin,
    Presets as HistoryPresets,
} from "rete-history-plugin";
import NodeWrapper from "./NodeWrapper";
import {
    useMagneticConnection,
    MagneticConnection,
} from "../magnetic-connection";

export async function createEditor(container, contextProps) {
    const socket = new ClassicPreset.Socket("socket");

    const { nodeList, setNodeList } = contextProps;

    // Initialize editor and plugins
    const editor = new NodeEditor();
    const area = new AreaPlugin(container);
    const connection = new ConnectionPlugin();
    const render = new ReactPlugin({ createRoot });
    const history = new HistoryPlugin();

    HistoryExtensions.keyboard(history, {
        undo: ["ctrl+z", "cmd+z"], // Keep undo as it is
        redo: ["ctrl+shift+a", "cmd+shift+z"], // Change redo to Ctrl+Shift+Z (Cmd+Shift+Z on macOS)
    });

    history.addPreset(HistoryPresets.classic.setup());

    // Mount plugins
    editor.use(area);
    area.use(connection);
    area.use(render);
    area.use(history);

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
                        // <CustomNode
                        //     {...props}
                        //     deleteNode={deleteNode}
                        //     duplicateNode={duplicateNode}
                        // />
                        <NodeWrapper
                            {...props}
                            {...contextProps}
                            deleteNode={deleteNode}
                            duplicateNode={duplicateNode}
                            handleNodeData={handleNodeData}
                        />
                    );
                },
                socket() {
                    return CustomSocket;
                },
                connection(data) {
                    if (data.payload.isMagnetic) return MagneticConnection;
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
            slug: "triggerManually",
        },
    ];

    // Helper function to create nodes
    async function makeNode(cfg) {
        console.log({ cfg });
        const node = new ClassicPreset.Node(cfg.id);

        // Add parent node inputs with multiple connections enabled
        cfg.inputs.forEach((key) =>
            node.addInput(key, new ClassicPreset.Input(socket, key, true))
        );

        // Add parent node outputs with multiple connections enabled
        cfg.outputs.forEach((key) =>
            node.addOutput(key, new ClassicPreset.Output(socket, key, true))
        );

        // Add subnodes with inputs and outputs supporting multiple connections
        // node.data = {};
        // node.data.subnodes = (cfg.subnodes || []).map((sn) => {
        //     const subnode = {
        //         ...sn,
        //         socket,
        //         inputs: {},
        //         outputs: {},
        //     };

        //     // Add input socket for subnode with multiple connections
        //     (sn.inputs || []).forEach((key) => {
        //         subnode.inputs[key] = new ClassicPreset.Input(
        //             socket,
        //             key,
        //             true
        //         );
        //     });

        //     // Add output socket for subnode with multiple connections
        //     (sn.outputs || []).forEach((key) => {
        //         subnode.outputs[key] = new ClassicPreset.Output(
        //             socket,
        //             key,
        //             true
        //         );
        //     });

        //     return subnode;
        // });

        // Set the position property explicitly
        node.position = { x: cfg.x, y: cfg.y };
        node.slug = cfg.slug; // Add slug to the node data
        // console.log({ cfg });
        if (cfg.status) {
            node.status = cfg.status; // Add status to the node data
        }
        node.id = cfg.id; // Ensure the node ID is set correctly

        node.label = cfg.label;

        await editor.addNode(node);
        await area.translate(node.id, { x: cfg.x, y: cfg.y });
        return node;
    }

    // Loop over the initial nodeConfigs and create nodes
    const created = {};
    for (let cfg of nodeList?.data) {
        created[cfg.id] = await makeNode(cfg);
    }

    // Dynamically add node function triggered by App.js
    const addNode = async (newNode) => {
        // nodeConfigs.push(newNode); // Add to the array
        setNodeList((prev) => {
            const updatedList = [...prev.data, newNode]; // Create a new array with the new node
            return { ...prev, data: updatedList }; // Update the context state
        }); // Update the context state
        const createdNode = await makeNode(newNode); // Wait for the node to be created
        return createdNode; // Return the created node
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

            console.log(
                sourceSocket,
                targetSocket,
                "sourceSocket and targetSocket"
            );
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

    // Magnetic connection setup
    useMagneticConnection(connection, {
        async createConnection(from, to) {
            if (from.side === to.side) return;
            const [source, target] =
                from.side === "output" ? [from, to] : [to, from];
            const sourceNode = editor.getNode(source.nodeId);
            const targetNode = editor.getNode(target.nodeId);

            await editor.addConnection(
                new ClassicPreset.Connection(
                    sourceNode,
                    source.key,
                    targetNode,
                    target.key
                )
            );
        },
        display(from, to) {
            return from.side !== to.side;
        },
        offset(socket, position) {
            const socketRadius = 10;
            return {
                x:
                    position.x +
                    (socket.side === "input" ? -socketRadius : socketRadius),
                y: position.y,
            };
        },
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
            slug: originalNode.slug,
            // subnodes: (originalNode.data.subnodes || []).map((sn) => ({
            //     ...sn,
            //     inputs: Object.keys(sn.inputs || {}), // Convert inputs to an array
            //     outputs: Object.keys(sn.outputs || {}), // Convert outputs to an array
            // })),
        };

        // Create the new node
        await makeNode(newNodeConfig);
        console.log(`Node duplicated successfully: ${newNodeConfig.id}`);
    };

    const handleNodeData = () => {
        console.log(nodeList, "nodeList in createEditor");
    };

    // Add connection function
    const addConnection = async (connectionData) => {
        const { source, sourceOutput, target, targetInput } = connectionData;
        const sourceNode = editor.getNode(source);
        const targetNode = editor.getNode(target);

        if (!sourceNode || !targetNode) {
            console.error("Source or target node not found for connection.");
            return;
        }

        await editor.addConnection(
            new ClassicPreset.Connection(
                sourceNode,
                sourceOutput,
                targetNode,
                targetInput
            )
        );
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
        addConnection,
    };
}
