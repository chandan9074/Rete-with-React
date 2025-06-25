import { createRoot } from "react-dom/client";
import { NodeEditor, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
    ConnectionPlugin,
    Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { ReactPlugin, Presets } from "rete-react-plugin";

export async function createEditor(container) {
    const socket = new ClassicPreset.Socket("socket");

    const editor = new NodeEditor();
    const area = new AreaPlugin(container); // Initialize AreaPlugin
    const connection = new ConnectionPlugin();
    const render = new ReactPlugin({ createRoot });

    // Enable selectable nodes
    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    // Add presets for rendering and connections
    render.addPreset(Presets.classic.setup());
    connection.addPreset(ConnectionPresets.classic.setup());

    // Use plugins
    editor.use(area); // Attach AreaPlugin to the editor
    area.use(connection);
    area.use(render);

    // Ensure nodes are rendered in the correct order
    AreaExtensions.simpleNodesOrder(area);

    // Expose socket and ClassicPreset for reuse
    editor.components = { ClassicPreset, socket };

    // Set the area property on editor.view
    editor.view = { area }; // Ensure editor.view.area is defined

    // Add a custom method to add nodes
    editor.addCustomNode = async (node) => {
        await editor.addNode(node); // Add the node to the editor
        await area.translate(node.id, { x: 0, y: 0 }); // Position the node
        await AreaExtensions.zoomAt(area, [node]); // Zoom to the newly added node
    };

    // Example: Add initial nodes (optional)
    const a = new ClassicPreset.Node("A");
    a.addControl("a", new ClassicPreset.InputControl("text", { initial: "a" }));
    a.addInput("input", new ClassicPreset.Input(socket)); // Add input
    a.addOutput("output", new ClassicPreset.Output(socket)); // Add output
    await editor.addNode(a);

    const b = new ClassicPreset.Node("B");
    b.addControl("b", new ClassicPreset.InputControl("text", { initial: "b" }));
    b.addInput("input", new ClassicPreset.Input(socket)); // Add input
    b.addOutput("output", new ClassicPreset.Output(socket)); // Add output
    await editor.addNode(b);

    await editor.addConnection(
        new ClassicPreset.Connection(a, "output", b, "input")
    );

    // Position nodes
    await area.translate(a.id, { x: 0, y: 0 });
    await area.translate(b.id, { x: 270, y: 0 });

    // Zoom to fit all nodes
    setTimeout(() => {
        AreaExtensions.zoomAt(area, editor.getNodes());
    }, 10);

    return editor; // Return the full editor object
}
