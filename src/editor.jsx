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

    // Use plugins
    editor.use(area); // Attach AreaPlugin to the editor
    area.use(connection);
    area.use(render);

    // Enable selectable nodes
    AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
        accumulating: AreaExtensions.accumulateOnCtrl(),
    });

    // Ensure nodes are rendered in the correct order
    AreaExtensions.simpleNodesOrder(area);

    // Add presets for rendering and connections
    render.addPreset({
        render: ({ node, bindSocket }) => {
            // if (!node) {
            //     console.log("Node is undefined or null");
            //     return null; // Don't render anything if the node is undefined
            // }
            console.log("Rendering node:", node);
            return (
                <div className="node">
                    <div className="title">{node?.label || "Unnamed Node"}</div>
                    <div className="sockets">
                        <div className="inputs">
                            {node?.inputs.map((input) => (
                                <div key={input.key} className="socket">
                                    {bindSocket(input)}
                                </div>
                            ))}
                        </div>
                        <div className="outputs">
                            {node?.outputs.map((output) => (
                                <div key={output.key} className="socket">
                                    {bindSocket(output)}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="subnodes">
                        {node?.subnodes.map((subnode, index) => (
                            <div
                                key={index}
                                className="subnode"
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData("subnode", subnode);
                                }}
                            >
                                {subnode}
                            </div>
                        ))}
                    </div>
                </div>
            );
        },
    });
    connection.addPreset(ConnectionPresets.classic.setup());

    // Expose socket and ClassicPreset for reuse
    editor.components = { ClassicPreset, socket };

    // Set the area property on editor.view
    editor.view = { area }; // Ensure editor.view.area is defined

    // Add a custom method to add nodes with subnodes
    editor.addCustomNode = async (node, subnodes = []) => {
        console.log("Adding node:", node); // Debug log
        node.subnodes = subnodes; // Attach subnodes to the node
        await editor.addNode(node); // Add the node to the editor
        console.log("Node after addNode:", node); // Debug log
        await area.translate(node.id, { x: 0, y: 0 }); // Position the node
        await AreaExtensions.zoomAt(area, [node]); // Zoom to the newly added node
    };

    // Example: Add initial nodes (optional)
    const a = new ClassicPreset.Node("A");
    a.label = "Node A"; // Set the label property
    // a.addControl("a", new ClassicPreset.InputControl("text", { initial: "a" }));
    a.addInput("input", new ClassicPreset.Input(socket)); // Add input
    a.addOutput("output", new ClassicPreset.Output(socket)); // Add output
    await editor.addCustomNode(a, ["Subnode 1", "Subnode 2"]); // Add subnodes
    console.log("Node A added:", a);

    const b = new ClassicPreset.Node("B");
    b.label = "Node B"; // Set the label property
    // b.addControl("b", new ClassicPreset.InputControl("text", { initial: "b" }));
    b.addInput("input", new ClassicPreset.Input(socket)); // Add input
    b.addOutput("output", new ClassicPreset.Output(socket)); // Add output
    await editor.addCustomNode(b, ["Subnode 3", "Subnode 4"]); // Add subnodes
    console.log("Node B added:", b);

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
