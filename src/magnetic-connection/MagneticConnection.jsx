import React from "react";
import { Presets } from "rete-react-plugin";

const { useConnection } = Presets.classic;

export function MagneticConnection({ data, styles }) {
    const { path } = useConnection();

    if (!path) return null;

    return (
        <svg
            data-testid="connection"
            className="absolute overflow-visible pointer-events-none w-[9999px] h-[9999px]"
        >
            <path
                className="fill-none stroke-[#ffd92c] stroke-[5px] pointer-events-auto"
                style={styles ? styles() : {}}
                d={path}
            />
        </svg>
    );
}
