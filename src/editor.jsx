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
import { StyledNode } from "./StyledNode";
import { useRef } from "react";

export async function createEditor(container) {
    const socket = new ClassicPreset.Socket("socket");

    // Initialize editor and plugins
    const editor = new NodeEditor();
    const area = new AreaPlugin(container);
    const connection = new ConnectionPlugin();
    const render = new ReactPlugin({ createRoot });

    // Enable node selection
    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl(),
    });

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

    // Mount plugins
    editor.use(area);
    area.use(connection);
    area.use(render);

    // Order nodes simply
    AreaExtensions.simpleNodesOrder(area);

    // Initialize node configs
    let nodeConfigs = [
        {
            label: "Parent Node A",
            id: "node1",
            x: 0,
            y: 0,
            inputs: ["a"],
            outputs: ["a"],
            subnodes: [
                { id: "sub1", label: "Child 1" },
                { id: "sub2", label: "Child 2" },
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

    // 1) Helper function to create nodes
    async function makeNode(cfg) {
        const node = new ClassicPreset.Node(cfg.label);

        cfg.inputs.forEach((key) =>
            node.addInput(key, new ClassicPreset.Input(socket))
        );
        cfg.outputs.forEach((key) =>
            node.addOutput(key, new ClassicPreset.Output(socket))
        );

        node.data = {};
        node.data.subnodes = (cfg.subnodes || []).map((sn) => ({
            ...sn,
            socket,
        }));

        await editor.addNode(node);
        await area.translate(node.id, { x: cfg.x, y: cfg.y });
        return node;
    }

    // Loop over the initial nodeConfigs and create nodes
    const created = {};
    for (let cfg of nodeConfigs) {
        created[cfg.id] = await makeNode(cfg);
    }

    // 2) Dynamically add node function triggered by App.js
    const addNode = (newNode) => {
        nodeConfigs.push(newNode); // Add to the array
        makeNode(newNode); // Create and render the node
    };

    // Zoom to fit
    setTimeout(() => {
        AreaExtensions.zoomAt(area, editor.getNodes());
    }, 100);

    return {
        destroy: () => area.destroy(),
        addNode, // Return the reference to addNode
    };
}
