import React from "react";
import { Presets } from "rete-react-plugin";

const { useConnection } = Presets.classic;

export function MagneticConnection({ data, styles }) {
    const { path } = useConnection();

    console.log({ path });

    if (!path) return null;

    return (
        <svg
            data-testid="connection"
            className="absolute overflow-visible pointer-events-none w-[9999px] h-[9999px] -top-2.5"
        >
            <path
                className="fill-none stroke-[#50555e] stroke-[5px] pointer-events-auto"
                style={styles ? styles() : {}}
                d={path}
            />
        </svg>
    );
}
