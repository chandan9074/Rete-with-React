import { useEffect, useRef } from "react";
import { createEditor } from "./editor"; // Assuming createEditor is defined in editor.jsx
import Sidebar from "./components/Sidebar"; // Assuming Sidebar is defined in components/Sidebar.jsx

// Mock data for nodes and connections
const mockData = {
    nodes: [
        {
            id: "node1",
            label: "Parent Node A",
            slug: "parent-node-a",
            inputs: [{ key: "input1", socket: { name: "socket" } }],
            outputs: [{ key: "output1", socket: { name: "socket" } }],
            subnodes: [
                {
                    id: "subnode1",
                    label: "Child 1",
                    inputs: [{ key: "input2", socket: { name: "socket" } }],
                    outputs: [{ key: "output2", socket: { name: "socket" } }],
                },
                {
                    id: "subnode2",
                    label: "Child 2",
                    inputs: [{ key: "input3", socket: { name: "socket" } }],
                    outputs: [{ key: "output3", socket: { name: "socket" } }],
                },
            ],
        },
        {
            id: "node2",
            label: "Parent Node B",
            slug: "parent-node-b",
            inputs: [{ key: "input4", socket: { name: "socket" } }],
            outputs: [{ key: "output4", socket: { name: "socket" } }],
            subnodes: [
                {
                    id: "subnode3",
                    label: "Child 3",
                    inputs: [{ key: "input5", socket: { name: "socket" } }],
                    outputs: [{ key: "output5", socket: { name: "socket" } }],
                },
                {
                    id: "subnode4",
                    label: "Child 4",
                    inputs: [{ key: "input6", socket: { name: "socket" } }],
                    outputs: [{ key: "output6", socket: { name: "socket" } }],
                },
            ],
        },
    ],
    connections: [
        // {
        //     source: "node1",
        //     sourceOutput: "output1", // Matches the output key of node1
        //     target: "node2",
        //     targetInput: "input4", // Matches the input key of node2
        // },
        // {
        //     source: "subnode1",
        //     sourceOutput: "output4", // Matches the output key of subnode1
        //     target: "subnode3",
        //     targetInput: "input5", // Matches the input key of subnode3
        // },
    ],
};

// // Flatten the nodes and subnodes for the editor
// function flattenNodes(mockData) {
//     const flattenedNodes = [];
//     mockData.nodes.forEach((parentNode) => {
//         // Add the parent node
//         flattenedNodes.push({
//             id: parentNode.id,
//             label: parentNode.label,
//             inputs: parentNode.inputs,
//             outputs: parentNode.outputs,
//         });

//         // Add the subnodes
//         parentNode.subnodes.forEach((subnode) => {
//             flattenedNodes.push({
//                 id: subnode.id,
//                 label: subnode.label,
//                 inputs: subnode.inputs,
//                 outputs: subnode.outputs,
//             });
//         });
//     });
//     return flattenedNodes;
// }

// // Flattened connections remain the same
// const flattenedMockData = {
//     nodes: flattenNodes(mockData),
//     connections: mockData.connections,
// };

// console.log(flattenedMockData);

function App() {
    const editorContainerRef = useRef(null); // Reference to the editor container
    const editorInitialized = useRef(false); // To ensure the editor initializes only once

    useEffect(() => {
        if (!editorInitialized.current) {
            console.log("Initializing editor...");
            editorInitialized.current = true;

            // Initialize the editor
            createEditor(editorContainerRef.current, mockData)
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
    const handleDrop = (event) => {
        event.preventDefault();
        const nodeType = event.dataTransfer.getData("nodeType");

        if (nodeType === "parentNode") {
            const newNodeId = `node${mockData.nodes.length + 1}`;
            const newNode = {
                id: newNodeId,
                label: `Parent Node ${mockData.nodes.length + 1}`,
                slug: `parent-node-${mockData.nodes.length + 1}`,
                inputs: [{ key: "input1", socket: { name: "socket" } }],
                outputs: [{ key: "output1", socket: { name: "socket" } }],
                subnodes: [],
            };

            console.log("Adding new parent node:", newNode);

            // Update the mockData state
            // setMockData((prevData) => ({
            //     ...prevData,
            //     nodes: [...prevData.nodes, newNode],
            // }));

            // Dynamically add the new node to the editor
            if (editorContainerRef.current) {
                const { addNode } = editorContainerRef.current.editor;
                console.log({ addNode });
                addNode(newNode).then(() => {
                    console.log("Node added successfully");
                });
                // editor.addNode(newNode); // Add the new node directly to the editor
            }
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault(); // Allow drop
    };

    return (
        <div className="App" style={{ display: "flex", height: "100vh" }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Editor Container */}
            <div
                ref={editorContainerRef}
                style={{ flex: 1, height: "100vh" }}
                onDrop={handleDrop} // Handle drop event
                onDragOver={handleDragOver} // Allow drag-over
            />
        </div>
    );
}

export default App;
