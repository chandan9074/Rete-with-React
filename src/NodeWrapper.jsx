import React from "react";
import Nodes from "./components/Nodes";
import CommonContextProvider from "./context/CommonContextProvider";

const NodeWrapper = (props) => {
    const { data } = props;
    const { slug } = data;

    // Map slug values to corresponding components
    const componentMap = {
        triggerManually: Nodes.ManualTrigger,
        onASchedule: Nodes.ScheduleTrigger,
        aiAgent: Nodes.AiAgent,
        googleSheetNode: Nodes.GoogleSheet,
        aggregateNode: Nodes.Aggregate,
        code: Nodes.Code,
        httpRequest: Nodes.HttpRequest,
        webhook: Nodes.Webhook,
        editFields: Nodes.EditFields,
        extractFromFile: Nodes.ExtractFromFile,
        // Add more mappings as needed
    };

    // Select the component based on the slug
    const SelectedComponent = componentMap[slug] || Nodes.Default;

    console.log({ data });

    // Render the selected component
    return <SelectedComponent {...props} />;
};

export default NodeWrapper;
