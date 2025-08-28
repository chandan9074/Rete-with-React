import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { Presets } from "rete-react-plugin";

const { useConnection } = Presets.classic;

export function CustomConnection(props) {
    const { path } = useConnection();
    const [isHovered, setIsHovered] = useState(false);

    if (!path) return null;

    // If you were passing a function to generate extra CSS,
    // call it here and pass the resulting object into style
    const extraStyle =
        typeof props.styles === "function" ? props.styles(props) : {};

    // Function to handle connection deletion
    const handleDeleteConnection = () => {
        // Try to get connection ID from different sources
        let connectionId = props.connectionId || props.data?.id || props.id;

        if (connectionId) {
            props.onDelete(connectionId);
        }
    };

    // Calculate the midpoint of the path for positioning the delete button
    const getPathMidpoint = () => {
        if (!path) return { x: 0, y: 0 };

        // Parse the SVG path to get coordinates
        const pathRegex =
            /M\s*(-?\d+(?:\.\d+)?)\s*(-?\d+(?:\.\d+)?)\s*.*L\s*(-?\d+(?:\.\d+)?)\s*(-?\d+(?:\.\d+)?)/;
        const match = path.match(pathRegex);

        if (match) {
            const [, x1, y1, x2, y2] = match.map(Number);
            return {
                x: (x1 + x2) / 2,
                y: (y1 + y2) / 2,
            };
        }

        // Fallback for bezier curves - approximate midpoint
        const bezierRegex =
            /M\s*(-?\d+(?:\.\d+)?)\s*(-?\d+(?:\.\d+)?)\s*C\s*(-?\d+(?:\.\d+)?)\s*(-?\d+(?:\.\d+)?)\s*(-?\d+(?:\.\d+)?)\s*(-?\d+(?:\.\d+)?)\s*(-?\d+(?:\.\d+)?)\s*(-?\d+(?:\.\d+)?)/;
        const bezierMatch = path.match(bezierRegex);

        if (bezierMatch) {
            const [, x1, y1, , , , , x2, y2] = bezierMatch.map(Number);
            return {
                x: (x1 + x2) / 2,
                y: (y1 + y2) / 2,
            };
        }

        return { x: 0, y: 0 };
    };

    const midpoint = getPathMidpoint();

    return (
        <svg
            data-testid="connection"
            className="absolute overflow-visible pointer-events-none w-[9999px] h-[9999px] -top-2.5"
        >
            <g
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="pointer-events-auto"
            >
                {/* Main connection path */}
                <path
                    d={path}
                    className="fill-none stroke-[5px] stroke-gray-200 hover:stroke-gray-300 transition-colors duration-200 cursor-pointer"
                    style={extraStyle}
                />

                {/* Invisible thicker path for easier hover detection */}
                <path
                    d={path}
                    className="fill-none stroke-[20px] stroke-transparent"
                />

                {/* Delete button */}
                {isHovered && (
                    <g>
                        {/* Background circle for delete button */}
                        <circle
                            cx={midpoint.x}
                            cy={midpoint.y}
                            r="12"
                            className="fill-red-500 hover:fill-red-600 transition-colors duration-200 cursor-pointer"
                            onClick={handleDeleteConnection}
                        />

                        {/* Delete icon */}
                        <foreignObject
                            x={midpoint.x - 8}
                            y={midpoint.y - 8}
                            width="16"
                            height="16"
                            className="pointer-events-none"
                        >
                            <MdDelete
                                className="text-white text-base w-4 h-4"
                                style={{ fontSize: "16px" }}
                            />
                        </foreignObject>
                    </g>
                )}
            </g>
        </svg>
    );
}
