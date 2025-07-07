import React, { useRef, useEffect } from "react";
import { Presets } from "rete-react-plugin";

const { useSocket } = Presets.classic;

export function CustomSocket(props) {
    const { socket, io, innerRef, className, style } = props;
    const ref = useRef(null);

    // this hook wires up all the mousedown/drag events
    useSocket({ socket, io, ref, getPosition: innerRef });

    // debug: do we ever render this component?
    useEffect(() => {
        console.log("🔌 CustomSocket rendered with props:", props);
    }, [props]);

    return (
        <div
            ref={ref}
            className={`custom-socket ${className || ""}`}
            style={{
                width: "10px",
                height: "10px",
                backgroundColor: "blue",
                borderRadius: "50%",
                ...style,
            }}
        />
    );
}
