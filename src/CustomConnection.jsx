import React from "react";
import { MdDelete } from "react-icons/md";
import { Presets } from "rete-react-plugin";

const { useConnection } = Presets.classic;

export function CustomConnection({ styles, ...props }) {
    const { path } = useConnection();

    if (!path) return null;

    // If you were passing a function to generate extra CSS,
    // call it here and pass the resulting object into style
    const extraStyle = typeof styles === "function" ? styles(props) : {};

    return (
        <svg
            data-testid="connection"
            className="absolute overflow-visible pointer-events-none w-[9999px] h-[9999px] -top-2.5"
        >
            <path
                d={path}
                className="fill-none stroke-[5px] stroke-gray-200 pointer-events-auto"
                style={extraStyle}
            />
        </svg>
    );
}
