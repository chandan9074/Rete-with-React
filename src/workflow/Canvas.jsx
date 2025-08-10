import React, { useState, useEffect, useRef } from "react";
import { useRete } from "rete-react-plugin";
import { createEditor } from "./editor";
import { HiPlusSm } from "react-icons/hi";
import SideDrawer from "../components/SideDrawer";
import FormDrawer from "../components/FormDrawer";
import { useCommon } from "../context/CommonContextProvider";
import { BsHourglassSplit } from "react-icons/bs";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

export default function Canvas() {
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

    const [open, setOpen] = useState(false); // State to manage the side drawer visibility
    // const [openFormDrawer, setOpenFormDrawer] = useState(false); // State to manage the form drawer visibility
    // const [selectedNode, setSelectedNode] = useState(null); // State to manage the selected node
    const { openFormDrawer, setOpenFormDrawer, selectedNode, setSelectedNode } =
        useCommon(); // Destructure the context to use common state if needed
    const editorContainerRef = useRef(null); // Reference to the editor container
    const editorInitialized = useRef(false); // To ensure the editor initializes only once
    const [nodeList, setNodeList] = useState({
        data: [
            {
                label: "When clicking 'Execute Workflow'",
                id: `node${Date.now()}`, // Unique ID
                x: 0,
                y: 0,
                inputs: ["a"],
                outputs: ["a"],
                slug: "triggerManually",
            },
        ],
    }); // State to manage the list of nodes
    const navigate = useNavigate();
    const location = useLocation();
    const [workflowData, setWorkflowData] = useState(null); // State to manage workflow data
    const [updateAsJson, setUpdateAdJson] = useState(false);

    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id"); // Get the 'id' query parameter
    console.log({ id }); // This will now correctly log the 'id' value

    useEffect(() => {
        if (!editorInitialized.current) {
            console.log("Initializing editor...");
            editorInitialized.current = true;

            // Initialize the editor
            createEditor(editorContainerRef.current, {
                openFormDrawer,
                setOpenFormDrawer,
                selectedNode,
                setSelectedNode,
                setNodeList,
                nodeList,
                handleExecution,
                setUpdateAdJson,
                updateAsJson,
            })
                .then((editorInstance) => {
                    console.log("Editor initialized successfully");
                    console.log({ editorInstance });
                    editorContainerRef.current.editor = editorInstance; // Store the editor instance
                })
                .catch((error) =>
                    console.error("Error initializing editor:", error)
                );
        }
    }, [nodeList]); // Empty dependency array ensures this runs only once

    // Handle drag-and-drop to add a new node
    const handleAddNode = (item) => {
        // event.preventDefault();
        // setSelectedNode(item); // Set the selected node from the item
        // setOpen(false); // Close the side drawer
        setOpenFormDrawer(true); // Open the form drawer
        console.log(item);
        const newNode = {
            label: item.label,
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
            setSelectedNode(newNode);
            // editor.addNode(newNode); // Add the new node directly to the editor
        }
    };

    // Handle submit button click to log nodes and connections
    const handleSubmit = (list) => {
        if (editorContainerRef.current) {
            const editor = editorContainerRef.current.editor;
            // const nodes = editor.getNodes().map((node) => {
            //     console.log("Node Data:", node);
            //     return {
            //         id: node.id,
            //         label: node.label,
            //         position: { x: node.position.x, y: node.position.y },
            //         inputs: Object.keys(node.inputs),
            //         outputs: Object.keys(node.outputs),
            //     };
            // });

            const connections = editor.getConnections().map((connection) => ({
                source: connection.source,
                sourceOutput: connection.sourceOutput,
                target: connection.target,
                targetInput: connection.targetInput,
            }));

            const data = {
                data: list,
                connections,
            };

            // console.log("Editor Data:", JSON.stringify(data, null, 2));
            console.log("Editor Data:", data);
        }
    };
    const handleFormDrawerClose = () => {
        setOpenFormDrawer(false);
        setSelectedNode(null);
        setUpdateAdJson(false);
        console.log(nodeList, "nodeList in App.jsx");
    };

    useEffect(() => {
        if (id) {
            handleGetNodes(id);
        }
    }, [id]);

    const handleGetNodes = async (wfId) => {
        try {
            const res = await axios.get(
                `http://192.168.68.160:7890/api/1.0.0/workflows/${wfId}`
            );

            console.log({ res });
            if (res.data && res.data.nodes && res.data.connections) {
                setWorkflowData(res.data); // Store the workflow data in state
                // setNodeList({ data: res.data.nodes }); // Update nodeList with the fetched nodes
                const newNodes = res.data.nodes;
                const newConnections = res.data.connections;

                // Preserve connections before removing nodes
                const editor = editorContainerRef.current.editor;
                const existingConnections = editor.getConnections();

                // Remove existing nodes
                const existingNodes = editor.getNodes();
                for (const node of existingNodes) {
                    await editor.deleteNode(node.id);
                }
                setNodeList({ data: [] }); // Clear the nodeList state

                // Add new nodes
                const nodeMap = {}; // Map to store added nodes for quick lookup
                for (const newNode of newNodes) {
                    // Replace newNode.id with newNode.frontendId
                    newNode.id = newNode.frontendId;

                    const { addNode } = editorContainerRef.current.editor;
                    const addedNode = await addNode(newNode); // Wait for the node to be added
                    console.log({ addedNode });
                    nodeMap[newNode.id] = addedNode; // Store the added node in the map
                }

                // console.log("New Nodes:", newNodes);
                // console.log("New Connections:", newConnections);
                // console.log("Node Map:", nodeMap);

                // Add connections after all nodes are added
                for (const connection of newConnections) {
                    const { addConnection } = editorContainerRef.current.editor;

                    // Ensure source and target nodes exist in the editor
                    const sourceNode = nodeMap[connection.sourceNodeFrontendId];
                    const targetNode = nodeMap[connection.targetNodeFrontendId];

                    if (sourceNode && targetNode) {
                        addConnection({
                            source: connection.sourceNodeFrontendId,
                            sourceOutput: connection.sourceOutput,
                            target: connection.targetNodeFrontendId,
                            targetInput: connection.targetInput,
                        });
                    } else {
                        console.error(
                            `Source or target node not found for connection: ${connection}`
                        );
                    }
                }

                console.log("Nodes and connections updated successfully.");
            }
        } catch (error) {
            console.error("Error getting workflow:", error);
        }
    };

    const handleExecution = async () => {
        if (id) {
            let intervalId = null; // Store the interval ID

            try {
                handleGetNodes(id);
                // Start polling handleGetNodes every 5 seconds
                intervalId = setInterval(() => {
                    handleGetNodes(id);
                }, 5000);

                // Execute the workflow
                const res = await axios.post(
                    `http://192.168.68.160:7890/api/1.0.0/workflows/execute/${id}`
                );

                console.log("API Response:", res);

                // Stop polling once the API call is complete
                clearInterval(intervalId);
                handleGetNodes(id);
            } catch (error) {
                console.error("Error executing workflow:", error);

                // Stop polling in case of an error
                if (intervalId) {
                    clearInterval(intervalId);
                }
            }
        }
    };
    const handleCreate = async () => {
        if (editorContainerRef.current) {
            const editor = editorContainerRef.current.editor;

            const connections = editor.getConnections().map((connection) => ({
                sourceNodeFrontendId: connection.source,
                sourceOutput: connection.sourceOutput,
                targetNodeFrontendId: connection.target,
                targetInput: connection.targetInput,
            }));

            const data = {
                name: "New Workflow",
                description: "This is a new workflow",
                nodes: nodeList.data.map((node) => ({
                    label: node?.label,
                    frontendId: node.id,
                    slug: node.slug,
                    x: node.x,
                    y: node.y,
                    inputs: node.inputs,
                    outputs: node.outputs,
                    ...(node.formData && { formData: node.formData }),
                })),
                connections,
            };

            console.log({ data, nodeList });

            const res = await axios.post(
                "http://192.168.68.160:7890/api/1.0.0/workflows/create",
                data
            );

            navigate(`?id=${res.data.id}`);

            console.log({ res });
        }
    };

    const handleUpdateWorkflow = async () => {
        if (editorContainerRef.current) {
            const editor = editorContainerRef.current.editor;

            const connections = editor.getConnections().map((connection) => ({
                sourceNodeFrontendId: connection.source,
                sourceOutput: connection.sourceOutput,
                targetNodeFrontendId: connection.target,
                targetInput: connection.targetInput,
            }));

            const data = {
                // name: "New Workflow",
                // description: "This is a new workflow",
                // nodes: nodeList.data.map((node) => ({
                //     frontendId: node.id,
                //     slug: node.slug,
                //     x: node.x,
                //     y: node.y,
                //     inputs: node.inputs,
                //     outputs: node.outputs,
                //     ...(node.formData && { formData: node.formData }),
                // })),
                // connections,
                ...workflowData, // Use the existing workflow data
                nodes: nodeList.data.map((node) => ({
                    label: node?.label,
                    frontendId: node.id,
                    slug: node.slug,
                    x: node.x,
                    y: node.y,
                    inputs: node.inputs,
                    outputs: node.outputs,
                    ...(node.formData && { formData: node.formData }),
                })),
                connections, // Update connections with the current state
            };

            console.log({ workflowData, data, nodeList });

            const res = await axios.put(
                `http://192.168.68.160:7890/api/1.0.0/workflows/update/${id}`,
                data
            );

            handleGetNodes(id); // Refresh the nodes after update

            console.log({ res });
        }
    };

    const handleUpdateWorkflowJsonDrawer = () => {
        setOpenFormDrawer(true);
        setSelectedNode({
            slug: "workflowJsonUpdate",
        });
        setUpdateAdJson(true);
    };

    return (
        <div className="App">
            {/* <button onClick={handleAddNode}>Add Node</button>{" "} */}
            {/* <button onClick={handleExecution}>Submit</button>{" "} */}
            {/* Button to add nodes */}
            <div className="absolute top-5 left-10 flex items-center gap-3">
                <button
                    onClick={() => navigate("/workflow-list")}
                    className="bg-gray-200 p-2 rounded-md cursor-pointer"
                >
                    <LuArrowLeft className="text-[#2D2E2E] text-xl" />
                </button>
            </div>
            <div className="absolute top-5 right-10 flex items-center gap-3">
                {id && (
                    <>
                        <button
                            onClick={handleUpdateWorkflowJsonDrawer}
                            // onClick={() => handleExecution(nodeList)}
                            className=" bg-[#FF6F5C] hover:bg-[#EF4E39] duration-300 py-2.5 px-5 rounded-md items-center gap-2 flex cursor-pointer"
                        >
                            <span className="text-gray-200 text-sm font-semibold whitespace-nowrap">
                                Update Workflow JSON
                            </span>
                        </button>
                        <button
                            onClick={handleExecution}
                            // onClick={() => handleExecution(nodeList)}
                            className=" bg-[#FF6F5C] hover:bg-[#EF4E39] duration-300 py-2.5 px-5 rounded-md items-center gap-2 flex cursor-pointer"
                        >
                            <BsHourglassSplit className="text-gray-200" />
                            <span className="text-gray-200 text-sm font-semibold whitespace-nowrap">
                                Execute Workflow
                            </span>
                        </button>

                        <button
                            onClick={handleUpdateWorkflow}
                            // onClick={() => handleExecution(nodeList)}
                            className=" bg-[#FF6F5C] hover:bg-[#EF4E39] duration-300 py-2.5 px-5 rounded-md items-center gap-2 flex cursor-pointer"
                        >
                            <span className="text-gray-200 text-sm font-semibold whitespace-nowrap">
                                Update
                            </span>
                        </button>
                    </>
                )}
                {!id && (
                    <button
                        onClick={handleCreate}
                        // onClick={() => handleExecution(nodeList)}
                        className=" bg-[#FF6F5C] hover:bg-[#EF4E39] duration-300 py-2.5 px-5 rounded-md items-center gap-2 flex cursor-pointer"
                    >
                        <span className="text-gray-200 text-sm font-semibold whitespace-nowrap">
                            Create
                        </span>
                    </button>
                )}
                <button
                    onClick={() => setOpen(true)}
                    className=" p-1 border border-gray-300 rounded-md cursor-pointer"
                >
                    <HiPlusSm className="text-4xl text-gray-300" />
                </button>
            </div>
            <SideDrawer
                open={open}
                setOpen={setOpen}
                handleSubmit={handleAddNode}
            />
            <FormDrawer
                openFormDrawer={openFormDrawer}
                handleFormDrawerClose={handleFormDrawerClose}
                selectedNode={selectedNode}
                setNodeList={setNodeList}
                nodeList={nodeList}
                handleSubmit={handleSubmit}
                setUpdateAdJson={setUpdateAdJson}
                updateAsJson={updateAsJson}
            />
            <div
                ref={editorContainerRef}
                className="bg-[#2D2E2E]"
                style={{ height: "100vh", width: "100vw" }}
            ></div>
        </div>
    );
}
