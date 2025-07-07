import React from "react";
import { Presets } from "rete-react-plugin";

const { RefSocket, RefControl } = Presets.classic;

// Utility to sort entries by their 'index' property
function sortByIndex(entries) {
    entries.sort((a, b) => {
        const ai = a[1]?.index || 0;
        const bi = b[1]?.index || 0;
        return ai - bi;
    });
}

export function CustomNode(props) {
    const { data, styles: stylesFn, emit } = props;
    const inputs = Object.entries(data.inputs);
    const outputs = Object.entries(data.outputs);
    const controls = Object.entries(data.controls);
    const selected = data.selected || false;
    const { id, label, width, height } = data;

    // Sort inputs, outputs, and controls by index
    sortByIndex(inputs);
    sortByIndex(outputs);
    sortByIndex(controls);

    // Determine node dimensions
    const nodeWidth = Number.isFinite(width) ? width : 200;
    const nodeHeight = Number.isFinite(height) ? height : undefined;

    // Compute any extra styles passed via props.styles
    const extraStyle = typeof stylesFn === "function" ? stylesFn(props) : {};

    return (
        <div
            data-testid="node"
            className={`
        bg-black
        border-2
        ${selected ? "border-red-500" : "border-gray-400"}
        rounded-lg
        cursor-pointer
        box-border
        relative
        select-none
      `}
            style={{
                width: `${nodeWidth}px`,
                ...(nodeHeight ? { height: `${nodeHeight}px` } : {}),
                paddingBottom: "6px",
                ...extraStyle,
            }}
        >
            {/* Title */}
            <div
                onPointerDown={(e) => {
                    e.stopPropagation();
                    console.log(">>>");
                }}
                className="title text-white font-sans text-lg p-2"
                data-testid="title"
            >
                {label}
            </div>

            {/* Outputs */}
            {outputs.map(([key, output]) =>
                output ? (
                    <div
                        className="output text-right"
                        key={key}
                        data-testid={`output-${key}`}
                    >
                        <div
                            className="output-title inline-block align-middle text-white font-sans text-sm"
                            data-testid="output-title"
                            style={{
                                margin: `6px`,
                                lineHeight: `16px`,
                            }}
                        >
                            {output.label}
                        </div>
                        <div
                            className="output-socket inline-block"
                            style={{ marginRight: -1 }}
                        >
                            <RefSocket
                                side="output"
                                emit={emit}
                                socketKey={key}
                                nodeId={id}
                                payload={output.socket}
                            />
                        </div>
                    </div>
                ) : null
            )}

            {/* Controls */}
            {controls.map(([key, control]) =>
                control ? (
                    <div
                        key={key}
                        className="control block"
                        style={{
                            padding: `6px ${16 / 2 + 6}px`,
                        }}
                    >
                        <RefControl
                            name="control"
                            emit={emit}
                            payload={control}
                        />
                    </div>
                ) : null
            )}

            {/* Inputs */}
            {inputs.map(([key, input]) =>
                input ? (
                    <div
                        className="input flex items-center"
                        key={key}
                        data-testid={`input-${key}`}
                    >
                        <div
                            className="input-socket inline-block"
                            style={{ marginLeft: -1 }}
                        >
                            <RefSocket
                                side="input"
                                emit={emit}
                                socketKey={key}
                                nodeId={id}
                                payload={input.socket}
                            />
                        </div>

                        {/* Label or control */}
                        {(!input.control || !input.showControl) && (
                            <div
                                className="input-title inline-block align-middle text-white font-sans text-sm"
                                data-testid="input-title"
                                style={{
                                    margin: `6px`,
                                    lineHeight: `16px`,
                                }}
                            >
                                {input.label}
                            </div>
                        )}
                        {input.control && input.showControl && (
                            <span
                                className="input-control inline-block align-middle"
                                style={{
                                    zIndex: 1,
                                    width: `calc(100% - ${16 + 2 * 6}px)`,
                                    lineHeight: `16px`,
                                }}
                            >
                                <RefControl
                                    name="input-control"
                                    emit={emit}
                                    payload={input.control}
                                />
                            </span>
                        )}
                    </div>
                ) : null
            )}
        </div>
    );
}
