import React, { useState, useEffect, useRef } from "react";
import { useRete } from "rete-react-plugin";
import { createEditor } from "./editor";
import { HiPlusSm } from "react-icons/hi";
import SideDrawer from "./components/SideDrawer";

export default function App() {
    const [open, setOpen] = useState(false); // State to manage the side drawer visibility
    // const [editorInstance, setEditorInstance] = useState(null); // Store editor instance
    // const [ref, addNode] = useRete(createEditor); // Get the ref but don't destructure addNode here

    // // Wait for the editor to be fully initialized
    // useEffect(() => {
    //     if (ref && ref.current) {
    //         console.log("Editor ref is initialized:", ref.current);
    //         // Now that ref is initialized, set the editor instance
    //         const { addNode } = ref.current; // Get addNode from the current instance
    //         setEditorInstance({ addNode });
    //     }
    // }, [ref]);

    // // Function to handle button click and add a new node
    // const handleAddNode = () => {
    //     console.log("Button clicked to add a new node", editorInstance);

    //     if (editorInstance && editorInstance.addNode) {
    //         const newNode = {
    //             label: "New Node",
    //             id: `node${Date.now()}`, // Unique ID
    //             x: Math.random() * 500, // Random position
    //             y: Math.random() * 500, // Random position
    //             inputs: ["a"],
    //             outputs: ["a"],
    //             subnodes: [{ id: "sub3", label: "Child 3" }],
    //         };

    //         console.log("Adding new node:", newNode);
    //         // Call the addNode function to create and render the node
    //         editorInstance.addNode(newNode);
    //     }
    // };

    const editorContainerRef = useRef(null); // Reference to the editor container
    const editorInitialized = useRef(false); // To ensure the editor initializes only once

    useEffect(() => {
        if (!editorInitialized.current) {
            console.log("Initializing editor...");
            editorInitialized.current = true;

            // Initialize the editor
            createEditor(editorContainerRef.current)
                .then((editorInstance) => {
                    console.log("Editor initialized successfully");
                    console.log({ editorInstance });
                    editorContainerRef.current.editor = editorInstance; // Store the editor instance
                })
                .catch((error) =>
                    console.error("Error initializing editor:", error)
                );
        }
    }, []); // Empty dependency array ensures this runs only once

    // Handle drag-and-drop to add a new node
    const handleAddNode = (item) => {
        // event.preventDefault();
        const newNode = {
            label: "New Node",
            id: `node${Date.now()}`, // Unique ID
            x: Math.random() * 500, // Random position
            y: Math.random() * 500, // Random position
            inputs: ["a"],
            outputs: ["a"],
            slug: item.slug, // Use the slug from the item
            // subnodes: [{ id: "sub3", label: "Child 3" }],
        };

        // Dynamically add the new node to the editor
        if (editorContainerRef.current) {
            const { addNode } = editorContainerRef.current.editor;
            console.log({ addNode });
            addNode(newNode);

            // editor.addNode(newNode); // Add the new node directly to the editor
        }
    };

    // Handle submit button click to log nodes and connections
    const handleSubmit = (item) => {
        if (editorContainerRef.current) {
            const editor = editorContainerRef.current.editor;
            const nodes = editor.getNodes().map((node) => {
                console.log("Node Data:", node);
                return {
                    id: node.id,
                    label: node.label,
                    position: { x: node.position.x, y: node.position.y },
                    inputs: Object.keys(node.inputs),
                    outputs: Object.keys(node.outputs),
                };
            });

            const connections = editor.getConnections().map((connection) => ({
                source: connection.source,
                sourceOutput: connection.sourceOutput,
                target: connection.target,
                targetInput: connection.targetInput,
            }));

            const data = {
                nodes,
                connections,
            };

            // console.log("Editor Data:", JSON.stringify(data, null, 2));
            console.log("Editor Data:", data);
        }
    };

    return (
        <div className="App">
            {/* <button onClick={handleAddNode}>Add Node</button>{" "}
            <button onClick={handleSubmit}>Submit</button>{" "} */}
            {/* Button to add nodes */}

            <button
                onClick={() => setOpen(true)}
                className="absolute top-5 right-10 p-1 border border-gray-300 rounded-md cursor-pointer"
            >
                <HiPlusSm className="text-4xl text-gray-300" />
            </button>
            <SideDrawer
                open={open}
                setOpen={setOpen}
                handleSubmit={handleAddNode}
            />
            <div
                ref={editorContainerRef}
                className="bg-[#2D2E2E]"
                style={{ height: "100vh", width: "100vw" }}
            ></div>
        </div>
    );
}
