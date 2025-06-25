import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { NodeEditor, ClassicPreset } from "rete";
import { useRete } from "rete-react-plugin";
import { createEditor } from "./editor";

function App() {
    const [ref, editor] = useRete(createEditor);
    const [isEditorReady, setIsEditorReady] = useState(false);

    useEffect(() => {
        if (editor) {
            if (!editor.components) {
                editor.components = {}; // Initialize components if missing
            }
            if (!editor.components.socket) {
                console.warn("Socket is missing, creating a new one.");
                editor.components.socket = new ClassicPreset.Socket("socket");
            }
            if (!editor.components.ClassicPreset) {
                console.warn("ClassicPreset is missing, adding it.");
                editor.components.ClassicPreset = ClassicPreset;
            }
            console.log("Editor initialized:", editor); // Debug log
            console.log("Editor components:", editor.components); // Debug log
            setIsEditorReady(true); // Mark editor as ready
        }
        // Cleanup function to destroy the editor on unmount
        return () => {
            if (editor && typeof editor.destroy === "function") {
                try {
                    editor.destroy();
                } catch (error) {
                    console.error("Error destroying editor:", error);
                }
            }
        };
    }, [editor]);

    const handleDragOver = (event) => {
        event.preventDefault(); // Allow dropping
    };

    const handleDrop = async (event) => {
        event.preventDefault();

        if (
            !isEditorReady ||
            !editor ||
            !editor.components ||
            !editor.components.socket
        ) {
            console.error("Editor is not initialized or socket is undefined");
            console.error("Editor:", editor); // Debug log
            return;
        }

        const subnode = event.dataTransfer.getData("subnode"); // Get subnode data
        if (subnode) {
            const rect = ref.current.getBoundingClientRect(); // Get canvas position
            const x = event.clientX - rect.left; // Calculate drop X
            const y = event.clientY - rect.top; // Calculate drop Y

            // Create a new node for the subnode
            const socket = editor.components.socket;
            const newNode = new editor.components.ClassicPreset.Node(subnode);
            newNode.addInput(
                "input",
                new editor.components.ClassicPreset.Input(socket)
            );
            newNode.addOutput(
                "output",
                new editor.components.ClassicPreset.Output(socket)
            );

            await editor.addCustomNode(newNode, [subnode]); // Add the subnode as its own node
            await editor.view.area.translate(newNode.id, { x, y }); // Position the new node
        } else {
            const nodeType = event.dataTransfer.getData("nodeType"); // Get node type
            if (nodeType === "customNode") {
                const rect = ref.current.getBoundingClientRect(); // Get canvas position
                const x = event.clientX - rect.left; // Calculate drop X
                const y = event.clientY - rect.top; // Calculate drop Y

                // Create a new node
                const socket = editor.components.socket; // Access the socket from editor.components
                const newNode = new editor.components.ClassicPreset.Node(
                    "New Node"
                );

                // Add both input and output sockets
                newNode.addInput(
                    "input",
                    new editor.components.ClassicPreset.Input(socket) // Add input socket
                );
                newNode.addOutput(
                    "output",
                    new editor.components.ClassicPreset.Output(socket) // Add output socket
                );

                // Add the node to the editor and position it
                await editor.addCustomNode(newNode); // Add node to editor
                await editor.view.area.translate(newNode.id, { x, y }); // Position node
            }
        }
    };

    return (
        <div
            className="relative h-screen"
            onDragOver={handleDragOver} // Allow drag-over
            onDrop={handleDrop} // Handle drop
        >
            <Sidebar />
            <div
                ref={ref}
                className="absolute top-0 right-0 z-10"
                style={{ height: "100%", width: "100vw" }}
            ></div>
        </div>
    );
}

export default App;
