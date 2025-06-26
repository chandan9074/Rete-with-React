import React from "react";
import { Presets } from "rete-react-plugin";

const { useConnection } = Presets.classic;

export function CustomConnection(props) {
    const { path } = useConnection(); // Get the connection path

    if (!path) {
        console.warn("Connection path is missing or undefined");
        // return null;
    }

    // Log the connection data for debugging
    console.log("CustomConnection props:", props);

    return (
        <svg
            className="absolute overflow-visible pointer-events-none w-[9999px] h-[9999px]"
            data-testid="connection"
        >
            <path
                d={path} // Render the connection path
                className="fill-none stroke-green-500 stroke-2 pointer-events-auto"
            />
        </svg>
    );
}
