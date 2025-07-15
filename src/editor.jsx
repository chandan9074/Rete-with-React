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
import { useRef } from "react";

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

    window.reteEditor = editor;

    // Enable node selection
    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    // area.emit({
    //     type: "contextmenu",
    //     data: {
    //         event: new MouseEvent("contextmenu", {
    //             clientX: 100,
    //             clientY: 100,
    //         }),
    //         node: { id: "test-node" },
    //     },
    // });

    // // Menu state
    // let menuVisible = false;
    // let menuPosition = { x: 0, y: 0 };
    // let selectedNodeId = null;

    // // Create menu element
    // const menuElement = document.createElement("div");
    // menuElement.className =
    //     "absolute bg-gray-700 text-white rounded shadow-md p-2";
    // menuElement.style.display = "none";
    // menuElement.style.zIndex = "1000";
    // document.body.appendChild(menuElement);

    // // Add menu options
    // const duplicateOption = document.createElement("div");
    // duplicateOption.className = "p-2 hover:bg-gray-600 cursor-pointer";
    // duplicateOption.innerText = "Duplicate";
    // duplicateOption.onclick = () => {
    //     console.log("Duplicate clicked");
    //     menuElement.style.display = "none";
    //     if (selectedNodeId) {
    //         const node = editor.getNode(selectedNodeId);
    //         if (node) {
    //             const newNode = {
    //                 ...node.data,
    //                 id: `node${Date.now()}`,
    //                 x: node.position.x + 50,
    //                 y: node.position.y + 50,
    //             };
    //             editor.addNode(newNode);
    //         }
    //     }
    // };

    // const deleteOption = document.createElement("div");
    // deleteOption.className = "p-2 hover:bg-gray-600 cursor-pointer";
    // deleteOption.innerText = "Delete";
    // deleteOption.onclick = () => {
    //     console.log("Delete clicked");
    //     menuElement.style.display = "none";
    //     if (selectedNodeId) {
    //         editor.removeNode(selectedNodeId);
    //     }
    // };

    // const copyOption = document.createElement("div");
    // copyOption.className = "p-2 hover:bg-gray-600 cursor-pointer";
    // copyOption.innerText = "Copy";
    // copyOption.onclick = () => {
    //     console.log("Copy clicked");
    //     menuElement.style.display = "none";
    //     // Implement copy logic here
    // };

    // menuElement.appendChild(duplicateOption);
    // menuElement.appendChild(deleteOption);
    // menuElement.appendChild(copyOption);

    // // Show menu
    // const showMenu = (x, y, nodeId) => {
    //     menuVisible = true;
    //     menuPosition = { x, y };
    //     selectedNodeId = nodeId;
    //     menuElement.style.display = "block";
    //     menuElement.style.left = `${x}px`;
    //     menuElement.style.top = `${y}px`;
    // };

    // // Hide menu
    // const hideMenu = () => {
    //     menuVisible = false;
    //     menuElement.style.display = "none";
    // };

    // // Add event listener for right-click on nodes
    // area.addPipe((context) => {
    //     console.log("Context data:", context);
    //     if (context.type === "contextmenu") {
    //         const { event, node } = context.data;
    //         console.log("nodecontextmenu event triggered:", { event, node });

    //         // Prevent the browser's default context menu
    //         if (event && event.preventDefault) {
    //             event.preventDefault();
    //         }

    //         // Show the custom menu
    //         showMenu(event.clientX, event.clientY, node.id);
    //         return;
    //     }
    //     return context;
    // });

    // container.addEventListener("contextmenu", (event) => {
    //     event.preventDefault();
    //     console.log("Browser context menu prevented globally");
    // });

    // // Add event listener for clicks outside the menu
    // document.addEventListener("mousedown", (event) => {
    //     if (!menuElement.contains(event.target)) {
    //         hideMenu();
    //     }
    // });

    // Register React preset with custom components
    render.addPreset(
        Presets.classic.setup({
            customize: {
                node(context) {
                    return CustomNode;
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

    // Remove node function to update nodeConfigs and editor
    const removeNode = async (nodeId) => {
        try {
            // Remove node from editor
            const node = editor.getNode(nodeId);
            if (node) {
                // Remove associated connections
                const connections = editor
                    .getConnections()
                    .filter(
                        (conn) =>
                            conn.source === nodeId || conn.target === nodeId
                    );
                for (const conn of connections) {
                    await editor.removeConnection(conn.id);
                }
                // Remove node from editor and area
                await editor.removeNode(nodeId);
                await area.removeNodeView(nodeId);
                // Update nodeConfigs
                nodeConfigs = nodeConfigs.filter((cfg) => cfg.id !== nodeId);
            }
        } catch (error) {
            console.error("Error removing node:", error);
        }
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

    // Zoom to fit
    setTimeout(() => {
        AreaExtensions.zoomAt(area, editor.getNodes());
    }, 100);

    return {
        destroy: () => area.destroy(),
        addNode, // Return the reference to addNode
        getNodes: () => editor.getNodes(),
        getConnections: () => editor.getConnections(),
        removeNode,
    };
}
