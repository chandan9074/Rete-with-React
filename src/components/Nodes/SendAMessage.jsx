import React, { useEffect, useRef, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { IoIosSettings } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { PiBracketsCurlyBold } from "react-icons/pi";
import { Dropdown } from "antd";
import { Presets } from "rete-react-plugin";
import Icons from "../../assets";

const { RefSocket, RefControl } = Presets.classic;

// Utility to sort entries by their 'index' property
function sortByIndex(entries) {
    entries.sort((a, b) => {
        const ai = a[1]?.index || 0;
        const bi = b[1]?.index || 0;
        return ai - bi;
    });
}

export function SendAMessage(props) {
    const {
        data,
        styles: stylesFn,
        emit,
        deleteNode,
        duplicateNode,
        openFormDrawer,
        setOpenFormDrawer,
        setSelectedNode,
        setOpenRenameModal,
        updateAsJson,
        setUpdateAdJson,
    } = props;
    const inputs = Object.entries(data.inputs);
    const outputs = Object.entries(data.outputs);
    const controls = Object.entries(data.controls);
    const selected = data.selected || false;
    const { id, label, width, height } = data;
    const [menuVisible, setMenuVisible] = useState(false);
    const nodeRef = useRef(null);

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
        setMenuVisible(true);
    };

    const handleMenuOptionClick = async (event, option) => {
        if (event) event.stopPropagation();
        switch (option) {
            case "Rename":
                setOpenRenameModal && setOpenRenameModal(data);
                break;
            case "Duplicate":
                duplicateNode(id);
                break;
            case "Delete":
                deleteNode(id);
                break;
            case "UpdateJSON":
                setUpdateAdJson && setUpdateAdJson(!updateAsJson);
                setOpenFormDrawer && setOpenFormDrawer(true);
                setSelectedNode && setSelectedNode(data);
                break;
            default:
                break;
        }
        setMenuVisible(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                nodeRef.current &&
                !nodeRef.current.contains(event.target) &&
                !event.target.closest(".ant-dropdown")
            ) {
                setMenuVisible(false);
            }
        };
        if (menuVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuVisible]);

    const handleNodeDoubleClick = (event) => {
        event.stopPropagation();
        setOpenFormDrawer(true);
        setSelectedNode(data);
    };

    const dropdownItems = [
        {
            label: (
                <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => handleMenuOptionClick(e, "Rename")}
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
            key: "2",
        },
        {
            label: (
                <button
                    onClick={(e) => handleMenuOptionClick(e, "UpdateJSON")}
                    className="w-[200px] text-left flex items-center justify-between"
                >
                    <span>Update JSON</span>
                    <PiBracketsCurlyBold className="text-base" />
                </button>
            ),
            key: "3",
        },
    ];

    return (
        <div className="group">
            <div
                ref={nodeRef}
                data-testid="node"
                className={
                    `bg-[#414244] relative border-2 border-gray-300 rounded-lg p-7 shadow-md` +
                    (selected ? " border-red-500" : "")
                }
                style={extraStyle}
                onContextMenu={handleRightClick}
            >
                {/* Sockets Row */}
                <div>
                    <img
                        src={Icons.gmail}
                        alt="gmail"
                        className="w-12 h-12 select-none"
                        draggable="false"
                    />
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
                <p className="text-gray-200 font-semibold text-sm absolute -left-0 -bottom-7 w-full text-center select-none">
                    {data.label || "Send a message"}
                </p>
            </div>
            <div
                className={`absolute -top-10 w-full p-3 group-hover:flex ${
                    menuVisible ? "flex" : "hidden"
                } items-center justify-center gap-2.5`}
            >
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
                <Dropdown
                    menu={{ items: dropdownItems }}
                    trigger={["click"]}
                    open={menuVisible}
                    onOpenChange={setMenuVisible}
                >
                    <button
                        onClick={() => setMenuVisible(true)}
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
