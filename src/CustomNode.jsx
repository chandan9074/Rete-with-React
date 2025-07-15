import React, { useEffect, useRef, useState } from "react";
import { Presets } from "rete-react-plugin";

const { RefSocket, RefControl } = Presets.classic;

// Utility to sort entries by their 'index' property
function sortByIndex(entries) {
    entries.sort((a, b) => {
        const ai = a[1]?.index || 0;
        const bi = b[1]?.index || 0;
        return ai - bi;
    });
}

export function CustomNode(props) {
    const { data, styles: stylesFn, emit } = props;
    const inputs = Object.entries(data.inputs);
    const outputs = Object.entries(data.outputs);
    const controls = Object.entries(data.controls);
    const selected = data.selected || false;
    const { id, label, width, height } = data;
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const nodeRef = useRef(null); // Reference to the node element
    const menuRef = useRef(null);
    const duplicateButtonRef = useRef(null);

    // Sort inputs, outputs, and controls by index
    sortByIndex(inputs);
    sortByIndex(outputs);
    sortByIndex(controls);

    // Determine node dimensions
    const nodeWidth = Number.isFinite(width) ? width : 200;
    const nodeHeight = Number.isFinite(height) ? height : undefined;

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

    const handleMenuOptionClick = (event, option) => {
        event.stopPropagation();
        console.log(`Menu option clicked: ${option}`);
        setMenuVisible(false);
        console.log(`Option selected: ${option}`);
        if (option === "Delete") {
            if (window.reteEditor) {
                window.reteEditor.removeNode(id);
            } else {
                console.error("Editor instance not found");
            }
        }
    };

    const handleClickOutside = (event) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target) &&
            nodeRef.current &&
            !nodeRef.current.contains(event.target) &&
            !event.target.closest(".p-2")
        ) {
            setMenuVisible(false); // Close the menu if clicked outside
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        // Attach click listener to the "Duplicate" button using ref
        if (duplicateButtonRef.current) {
            duplicateButtonRef.current.addEventListener("click", (e) =>
                handleMenuOptionClick(e, "Duplicate")
            );
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);

            // Cleanup the event listener for the "Duplicate" button
            if (duplicateButtonRef.current) {
                duplicateButtonRef.current.removeEventListener("click", (e) =>
                    handleMenuOptionClick(e, "Duplicate")
                );
            }
        };
    }, []);

    return (
        <div>
            <div
                ref={nodeRef} // Attach the ref to the node element
                data-testid="node"
                className={
                    `bg-gray-800/70  border-2 border-gray-600 rounded-lg p-4 shadow-md w-64` +
                    (selected ? " border-red-500" : "")
                }
                style={extraStyle}
                onContextMenu={handleRightClick}
            >
                {/* Node Title */}
                <div className="text-white text-lg font-bold mb-4 text-center">
                    {label || "Custom Node"}
                </div>
                <button
                    className="cursor-pointer"
                    style={{ pointerEvents: "auto", zIndex: 1000 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log("Button clicked", e);
                    }}
                >
                    Click here
                </button>

                {/* Sockets Row */}
                <div className="flex justify-between">
                    {/* Inputs */}
                    <div className="flex flex-col space-y-2">
                        {inputs.map(([key, input]) => (
                            <div
                                key={key}
                                className="flex items-center space-x-2"
                            >
                                <RefSocket
                                    side="input"
                                    emit={emit}
                                    socketKey={key}
                                    nodeId={id}
                                    payload={input.socket}
                                    className="w-4 h-4 bg-blue-500 rounded-full"
                                    style={{ cursor: "pointer" }}
                                />
                                <div className="text-white text-sm">
                                    {input.socket.name || key}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Outputs */}
                    <div className="flex flex-col space-y-2 items-end">
                        {outputs.map(([key, output]) => (
                            <div
                                key={key}
                                className="flex items-center space-x-2"
                            >
                                <div className="text-white text-sm">
                                    {output.socket.name || key}
                                </div>
                                <RefSocket
                                    side="output"
                                    emit={emit}
                                    socketKey={key}
                                    nodeId={id}
                                    payload={output.socket}
                                    className="w-4 h-4 bg-green-500 rounded-full"
                                    style={{ cursor: "pointer" }}
                                />
                            </div>
                        ))}
                    </div>
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

                {/* Subnodes */}
                {data.data.subnodes?.length > 0 && (
                    <div className="mt-4">
                        <div className="text-gray-400 text-sm mb-2">
                            Subnodes:
                        </div>
                        <div className="flex flex-col space-y-2">
                            {data.data.subnodes.map((subnode) => (
                                <div
                                    key={subnode.id}
                                    className="flex items-center space-x-2"
                                >
                                    {/* Label */}
                                    <div className="text-white text-sm">
                                        {subnode.label}
                                    </div>

                                    {/* Actual Rete socket */}
                                    <RefSocket
                                        side="output"
                                        emit={emit}
                                        socketKey={subnode.id}
                                        nodeId={data.id}
                                        payload={subnode.socket}
                                        className="w-3 h-3 bg-blue-500 rounded-full"
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            {menuVisible && (
                <div
                    ref={menuRef}
                    className="absolute bg-gray-700 text-white rounded shadow-md p-2"
                    style={{
                        top: menuPosition.y,
                        right: -(menuPosition.x + 110),
                        zIndex: 1000,
                    }}
                >
                    <button
                        ref={duplicateButtonRef} // Attach ref to the "Duplicate" button
                        className="p-2 hover:bg-gray-600 cursor-pointer"
                    >
                        Duplicate
                    </button>
                    <div
                        className="p-2 hover:bg-gray-600 cursor-pointer"
                        onClick={(e) => handleMenuOptionClick(e, "Delete")}
                    >
                        Delete
                    </div>
                    <div
                        className="p-2 hover:bg-gray-600 cursor-pointer"
                        onClick={() => handleMenuOptionClick("Copy")}
                    >
                        Copy
                    </div>
                </div>
            )}
        </div>
    );
}
