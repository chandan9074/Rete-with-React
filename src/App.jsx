import React, { useState, useEffect, useRef } from "react";
import { useRete } from "rete-react-plugin";
import { createEditor } from "./editor";

export default function App() {
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
    const handleAddNode = (event) => {
        event.preventDefault();
        const newNode = {
            label: "New Node",
            id: `node${Date.now()}`, // Unique ID
            x: Math.random() * 500, // Random position
            y: Math.random() * 500, // Random position
            inputs: ["a"],
            outputs: ["a"],
            subnodes: [{ id: "sub3", label: "Child 3" }],
        };

        // Dynamically add the new node to the editor
        if (editorContainerRef.current) {
            const { addNode } = editorContainerRef.current.editor;
            console.log({ addNode });
            addNode(newNode).then(() => {
                console.log("Node added successfully");
            });
            // editor.addNode(newNode); // Add the new node directly to the editor
        }
    };

    return (
        <div className="App">
            <button onClick={handleAddNode}>Add Node</button>{" "}
            {/* Button to add nodes */}
            <div
                ref={editorContainerRef}
                style={{ height: "100vh", width: "100vw" }}
            ></div>
        </div>
    );
}
