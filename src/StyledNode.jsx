import React from "react";
import { Presets } from "rete-react-plugin";

export function StyledNode(props) {
    const { selected, className = "", ...rest } = props;
    const baseClasses = "bg-gray-200 border border-gray-500 hover:bg-gray-100";
    const selectedClasses = selected ? "border-red-500" : "";

    return (
        <Presets.classic.Node
            {...rest}
            className={`${baseClasses} ${selectedClasses} ${className}`}
        />
    );
}
