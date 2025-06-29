import React from "react";

export const CustomNode = (props) => {
    const { data } = props; // Extract data from props
    const { inputs, outputs, controls, label } = data; // Destructure data properties

    console.log({ props });

    return (
        <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-4 shadow-md w-64">
            {/* Node Title */}
            <div className="text-white text-lg font-bold mb-4 text-center">
                {label || "Custom Node"}
            </div>

            {/* Sockets */}
            <div className="flex justify-between">
                {/* Inputs */}
                <div className="flex flex-col space-y-2">
                    {Object.entries(inputs).map(([key, input]) => (
                        <div key={key} className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                            <div className="text-white text-sm">
                                {input.socket.name || "Input"}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Outputs */}
                <div className="flex flex-col space-y-2 items-end">
                    {Object.entries(outputs).map(([key, output]) => (
                        <div key={key} className="flex items-center space-x-2">
                            <div className="text-white text-sm">
                                {output.socket.name || "Output"}
                            </div>
                            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subnodes */}
            {data?.data?.subnodes && data?.data?.subnodes.length > 0 && (
                <div className="mt-4">
                    <div className="text-gray-400 text-sm mb-2">Subnodes:</div>
                    <div className="flex flex-col space-y-2">
                        {data?.data?.subnodes.map((subnode) => (
                            <div
                                key={subnode.id}
                                className="bg-gray-700 text-white text-sm px-2 py-1 rounded-md"
                            >
                                {subnode.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
