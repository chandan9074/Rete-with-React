import React from "react";
import { FaSquareShareNodes } from "react-icons/fa6";

const Sidebar = () => {
    const handleDragStart = (event) => {
        event.dataTransfer.setData("nodeType", "customNode"); // Pass node type
    };

    return (
        <div
            className="absolute top-0 left-0 h-full bg-transparent p-5 z-20"
            style={{ width: "250px" }}
        >
            <div className="bg-black text-white h-full rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4 text-center">Workflow</h2>
                <div className="flex justify-center mt-6">
                    <button
                        className="py-4 px-5 bg-gray-800 rounded-xl flex flex-col items-center justify-center"
                        draggable
                        // onClick={() => console.log("clicked")}
                        onDragStart={handleDragStart} // Enable drag-and-drop
                    >
                        <FaSquareShareNodes className="text-white text-3xl" />
                        <span className="text-sm font-medium mt-3">
                            D&D Node
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
