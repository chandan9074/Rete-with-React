import React from "react";
import Nodes from "./components/Nodes";

const NodeWrapper = (props) => {
    return <Nodes.HttpRequest {...props} />;
};

export default NodeWrapper;
