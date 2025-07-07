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

export async function createEditor(container, data) {
    const socket = new ClassicPreset.Socket("socket");

    const editor = new NodeEditor();
    const area = new AreaPlugin(container);
    const connection = new ConnectionPlugin();
    const render = new ReactPlugin({ createRoot });

    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    render.addPreset(
        Presets.classic.setup({
            customize: {
                node: () => CustomNode,
                socket: () => CustomSocket,
                connection: () => CustomConnection,
            },
        })
    );

    connection.addPreset(ConnectionPresets.classic.setup());

    addCustomBackground(area);

    editor.use(area);
    area.use(connection);
    area.use(render);

    AreaExtensions.simpleNodesOrder(area);

    // Helper function to create a node
    const createNode = async (nodeData) => {
        const node = new ClassicPreset.Node(nodeData.label);

        // Initialize inputs
        Object.entries(nodeData.inputs || {}).forEach(([key, input]) => {
            node.addInput(key, new ClassicPreset.Input(socket));
        });

        // Initialize outputs
        Object.entries(nodeData.outputs || {}).forEach(([key, output]) => {
            node.addOutput(key, new ClassicPreset.Output(socket));
        });

        // Attach subnodes to the node's data
        node.slug = nodeData.slug || nodeData.id; // Use slug or id as slug
        node.data = node.data || {}; // Ensure node.data is initialized
        node.data.subnodes = nodeData.subnodes || []; // Attach subnodes

        await editor.addNode(node);
        await area.translate(node.id, {
            x: Math.random() * 500,
            y: Math.random() * 500,
        }); // Random position
        return node;
    };

    // Render parent nodes only
    const nodeMap = {}; // Map to store nodes by ID
    for (const nodeData of data.nodes) {
        const node = await createNode(nodeData);
        nodeMap[nodeData.id] = node;
    }

    console.log({ nodeMap });

    // Render connections
    for (const connectionData of data.connections) {
        const sourceNode = nodeMap[connectionData.source];
        const targetNode = nodeMap[connectionData.target];
        if (sourceNode && targetNode) {
            await editor.addConnection(
                new ClassicPreset.Connection(
                    sourceNode,
                    connectionData.sourceOutput,
                    targetNode,
                    connectionData.targetInput
                )
            );
        }
    }

    setTimeout(() => {
        AreaExtensions.zoomAt(area, editor.getNodes());
    }, 100);

    // Expose the addNode function
    const addNode = async (nodeData) => {
        const node = await createNode(nodeData);
        nodeMap[nodeData.id] = node; // Add the new node to the nodeMap
        return node;
    };

    return {
        editor, // Return the editor instance
        destroy: () => area.destroy(), // Add a destroy method to clean up the editor
        addNode, // Expose the addNode function
    };
}
