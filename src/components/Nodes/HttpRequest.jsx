import React, { useEffect, useRef, useState } from "react";
import { CiGlobe } from "react-icons/ci";
import {
    FaCheck,
    FaClock,
    FaMousePointer,
    FaPlay,
    FaTimes,
} from "react-icons/fa";
import { Presets } from "rete-react-plugin";
import { useCommon } from "../../context/CommonContextProvider";
import { MdDelete, MdEdit } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { IoIosSettings } from "react-icons/io";
import { Dropdown, Spin } from "antd";
import { MoonLoader, RingLoader } from "react-spinners";
import ContextMenu from "../ContextMenu";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { PiBracketsCurlyBold } from "react-icons/pi";
import { FcProcess } from "react-icons/fc";

const { RefSocket, RefControl } = Presets.classic;

// Utility to sort entries by their 'index' property
function sortByIndex(entries) {
    entries.sort((a, b) => {
        const ai = a[1]?.index || 0;
        const bi = b[1]?.index || 0;
        return ai - bi;
    });
}

export function HttpRequest(props) {
    const {
        data,
        styles: stylesFn,
        emit,
        deleteNode,
        duplicateNode,
        openFormDrawer,
        setOpenFormDrawer,
        selectedNode,
        setOpenRenameModal,
        setSelectedNode,
        nodeList,
        handleNodeData,
        updateAsJson,
        setUpdateAdJson,
    } = props;
    const inputs = Object.entries(data.inputs);
    const outputs = Object.entries(data.outputs);
    const controls = Object.entries(data.controls);
    const selected = data.selected || false;
    const { id, label, width, height } = data;
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const nodeRef = useRef(null); // Reference to the node element
    // const { openFormDrawer, setOpenFormDrawer, selectedNode, setSelectedNode } =
    //     useCommon();

    // Sort inputs, outputs, and controls by index
    sortByIndex(inputs);
    sortByIndex(outputs);
    sortByIndex(controls);

    // Compute any extra styles passed via props.styles
    const extraStyle = typeof stylesFn === "function" ? stylesFn(props) : {};

    // Constants for socket/control spacing
    const socketMargin = 6;
    const socketSize = 16;

    const handleRightClick = (event) => {
        event.preventDefault();
        if (nodeRef.current) {
            const rect = nodeRef.current.getBoundingClientRect(); // Get the node's position
            console.log({ rect });
            setMenuPosition({
                x: 0, // Position the menu to the right of the node
                y: 0, // Align the menu vertically with the node
            });
            setMenuVisible(true);
        }
    };

    const handleMenuOptionClick = async (event, option) => {
        event.stopPropagation();

        console.log("click");

        switch (option) {
            case "Duplicate":
                // Logic to duplicate the node
                console.log(`Duplicating node with ID: ${id}`);
                duplicateNode(id);
                // Here you would typically clone the node and add it to the editor
                break;
            case "Copy":
                // Logic to copy the node
                console.log(`Copying node with ID: ${id}`);
                break;
            case "Delete":
                // Logic to delete the node
                deleteNode(id);
                console.log(`Deleting node with ID: ${id}`);
                break;
            default:
                console.warn(`Unknown menu option: ${option}`);
        }
    };

    const handleClickOutside = (event) => {
        // if (
        //     menuRef.current &&
        //     !menuRef.current.contains(event.target) &&
        //     nodeRef.current &&
        //     !nodeRef.current.contains(event.target) &&
        //     !event.target.closest(".p-2")
        // ) {
        //     console.log("Clicked outside the node or menu");
        //     setMenuVisible(false); // Close the menu if clicked outside
        // }
        setMenuVisible(false); // Close the menu if clicked outside
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNodeDoubleClick = (event) => {
        console.log("click");
        event.stopPropagation(); // Prevent the context menu from appearing
        console.log({ setOpenFormDrawer, openFormDrawer });
        setOpenFormDrawer(true); // Open the form drawer
        console.log(data, "data in HttpRequest.jsx");
        setSelectedNode(data); // Set the selected node in context
        // Here you can handle the double-click event, like opening a form drawer
    };

    console.log(data, "data in HttpRequest.jsx");

    const items = [
        // {
        //     label: (
        //         <button className="w-[200px] text-left flex items-center justify-between">
        //             <span>Execute Step</span>
        //             <FcProcess className="text-base text-white" />
        //         </button>
        //     ),
        //     key: '3',
        // },
        {
            label: (
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => setOpenRenameModal(data)}
                    className="w-[200px] text-left flex items-center justify-between"
                >
                    <span>Rename</span>
                    <MdEdit className="text-base" />
                </button>
            ),
            key: "0",
        },
        {
            label: (
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => handleMenuOptionClick(e, "Duplicate")}
                    className="w-[200px] text-left flex items-center justify-between"
                >
                    <span>Duplicate</span>
                    <HiOutlineDocumentDuplicate className="text-base" />
                </button>
            ),
            key: "1",
        },
        {
            label: (
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => handleMenuOptionClick(e, "Delete")}
                    className="w-[200px] text-left flex items-center justify-between"
                >
                    <span>Delete</span>
                    <MdDelete className="text-base" />
                </button>
            ),
            key: "4",
        },
        {
            label: (
                <button
                    onClick={(e) => {
                        setUpdateAdJson(!updateAsJson);
                        handleNodeDoubleClick(e);
                    }}
                    className="w-[200px] text-left flex items-center justify-between"
                >
                    <span>Update JSON</span>
                    <PiBracketsCurlyBold className="text-base" />
                </button>
            ),
            key: "2",
        },
    ];

    return (
        <div className="group">
            <div
                ref={nodeRef} // Attach the ref to the node element
                data-testid="node"
                className={
                    `bg-[#414244] relative  border-2 ${
                        data?.status === "success"
                            ? "border-green-500"
                            : data?.status === "failed" ||
                              data?.status === "error"
                            ? "border-red-500"
                            : "border-gray-300"
                    } rounded-lg p-7 shadow-md` +
                    (selected ? " border-orange-500" : "")
                }
                style={extraStyle}
                onContextMenu={handleRightClick}
            >
                {/* Sockets Row */}
                <div
                // onDoubleClick={handleNodeDoubleClick}
                // onPointerDown={(e) => e.stopPropagation()}
                >
                    <CiGlobe className="text-5xl text-[#8F87F7]" />
                </div>

                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    {data.status === "pending" && (
                        // <Spin size="large" className="text-red-500" />
                        <RingLoader size={60} color="#ffffff" />
                    )}
                </div>
                <div className="absolute bottom-2 right-2">
                    {data?.status === "success" && (
                        <FaCheck className="text-xl text-green-500" />
                    )}
                    {(data?.status === "failed" ||
                        data?.status === "error") && (
                        <FaTimes className="text-xl text-red-500" />
                    )}
                </div>

                <div className="absolute -left-2.5 top-1/2 transform -translate-y-1/2">
                    {inputs.map(([key, input]) => (
                        <div key={key}>
                            <RefSocket
                                side="input"
                                emit={emit}
                                socketKey={key}
                                nodeId={id}
                                payload={input.socket}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                    ))}
                </div>
                {/* Outputs */}
                <div className="absolute -right-2.5 top-1/2 transform -translate-y-1/2">
                    {outputs.map(([key, output]) => (
                        <div key={key}>
                            <RefSocket
                                side="output"
                                emit={emit}
                                socketKey={key}
                                nodeId={id}
                                payload={output.socket}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                    ))}
                </div>

                {/* Controls */}
                {controls.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {controls.map(
                            ([key, control]) =>
                                control && (
                                    <div
                                        key={key}
                                        className="control block"
                                        style={{
                                            padding: `${socketMargin}px ${
                                                socketSize / 2 + socketMargin
                                            }px`,
                                        }}
                                    >
                                        <RefControl
                                            name={key}
                                            emit={emit}
                                            payload={control}
                                        />
                                    </div>
                                )
                        )}
                    </div>
                )}
                <p className="text-gray-200 font-semibold text-sm absolute -left-9 top-28 w-44 text-center select-none">
                    {data.label || "HTTP Request"}
                </p>
            </div>
            <div
                className={`absolute -top-10 w-full p-3  group-hover:flex ${
                    menuVisible ? "flex" : "hidden"
                } items-center justify-center gap-2.5`}
            >
                {/* <button
                    onClick={handleNodeData}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="cursor-pointer"
                >
                    <FaPlay className="text-sm text-gray-500" />
                </button> */}
                <button
                    className="cursor-pointer"
                    onClick={(e) => handleMenuOptionClick(e, "Delete")}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <MdDelete className="text-lg text-gray-500" />
                </button>
                <button
                    className="cursor-pointer"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={handleNodeDoubleClick}
                >
                    <IoIosSettings className="text-lg text-gray-500" />
                </button>
                <Dropdown menu={{ items }} trigger={["click"]}>
                    <button
                        onClick={() => setMenuVisible(true)}
                        // onClick={e => e.preventDefault()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="cursor-pointer"
                    >
                        <BsThreeDots className="text-lg text-gray-500" />
                    </button>
                </Dropdown>
            </div>
        </div>
    );
}
