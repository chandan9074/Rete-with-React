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
                node() {
                    return CustomNode; // Use CustomNode for all nodes
                },
                socket() {
                    return CustomSocket; // Use CustomSocket for all sockets
                },
                connection() {
                    return CustomConnection; // Use CustomConnection for all connections
                },
            },
        })
    );

    connection.addPreset(ConnectionPresets.classic.setup());

    addCustomBackground(area);

    editor.use(area);
    area.use(connection);
    area.use(render);

    AreaExtensions.simpleNodesOrder(area);

    // Expose socket and ClassicPreset for reuse
    editor.components = { ClassicPreset, socket };

    // Set the area property on editor.view
    editor.view = { area }; // Ensure editor.view.area is defined

    // Add a method to handle nodes with subnodes
    editor.addCustomNode = async (node, subnodes = []) => {
        console.log("Adding node:", node);
        node.subnodes = subnodes; // Attach subnodes to the node
        await editor.addNode(node); // Add the node to the editor
        console.log("Node after addNode:", node);
        await area.translate(node.id, { x: 0, y: 0 }); // Position the node
        await AreaExtensions.zoomAt(area, [node]); // Zoom to the newly added node
    };

    // Example: Create nodes with subnodes
    const a = new ClassicPreset.Node("Parent Node A");
    a.addOutput("a", new ClassicPreset.Output(socket));
    a.addInput("a", new ClassicPreset.Input(socket));
    await editor.addCustomNode(a, ["Child 1", "Child 2"]);

    const b = new ClassicPreset.Node("Parent Node B");
    b.addOutput("b", new ClassicPreset.Output(socket));
    b.addInput("b", new ClassicPreset.Input(socket));
    await editor.addCustomNode(b, ["Child 3", "Child 4"]);

    await area.translate(a.id, { x: 0, y: 0 });
    await area.translate(b.id, { x: 300, y: 0 });

    await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "b"));

    setTimeout(() => {
        AreaExtensions.zoomAt(area, editor.getNodes());
    }, 100);

    // return {
    //     destroy: () => area.destroy(),
    // };
    return editor; // Return the full editor object
}
