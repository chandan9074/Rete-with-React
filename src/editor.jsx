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
                    if (context.payload.label === "Fully customized") {
                        return CustomNode;
                    }
                    if (context.payload.label === "Override styles") {
                        return StyledNode;
                    }
                    return Presets.classic.Node;
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

    // Create two nodes and a connection between them
    const a = new ClassicPreset.Node("Override styles");
    a.addOutput("a", new ClassicPreset.Output(socket));
    a.addInput("a", new ClassicPreset.Input(socket));
    await editor.addNode(a);

    const b = new ClassicPreset.Node("Fully customized");
    b.addOutput("a", new ClassicPreset.Output(socket));
    b.addInput("a", new ClassicPreset.Input(socket));
    await editor.addNode(b);

    // Position nodes
    await area.translate(a.id, { x: 0, y: 0 });
    await area.translate(b.id, { x: 300, y: 0 });

    // Connect nodes
    await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "a"));

    // Zoom to fit
    setTimeout(() => {
        AreaExtensions.zoomAt(area, editor.getNodes());
    }, 100);

    return {
        destroy: () => area.destroy(),
    };
}
