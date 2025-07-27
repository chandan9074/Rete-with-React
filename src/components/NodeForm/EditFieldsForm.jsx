import { Editor } from "@monaco-editor/react";
import { Form, Input, Select, Switch } from "antd";
import React, { use } from "react";
import { BsHourglassSplit } from "react-icons/bs";
import { CiGlobe } from "react-icons/ci";
import { MdEdit } from "react-icons/md";

const EditFieldsForm = ({ data, setNodeList, nodeList, handleSubmit }) => {
    const [form] = Form.useForm();
    const [switchData, setSwitchData] = React.useState({
        isQuery: false,
        isHeaders: false,
        isBody: false,
    });
    console.log(data);

    const onFinish = (values) => {
        console.log(data.id, "data.id in onFinish");
        console.log(nodeList, "nodeList in onFinish");
        const updatedNodeList = nodeList?.data?.map((node) => {
            if (node.id === data.id) {
                return {
                    ...node,
                    formData: {
                        method: values.method,
                        url: values.url,
                        queryData: values.queryData,

                        headerData: values.headerData,

                        bodyData: values.bodyData,
                    },
                };
            }
            return node;
        });
        console.log("Updated Node List:", updatedNodeList);
        setNodeList((prev) => ({
            ...prev,
            data: updatedNodeList,
        }));
        handleSubmit(updatedNodeList);
        console.log(values);
    };

    return (
        <div className="grid grid-cols-3">
            <div className="">
                <p className="text-gray-200 text-lg pb-5 tracking-[6px] mt-6 mx-6">
                    INPUT
                </p>
                <Editor
                    height="85vh"
                    defaultLanguage="json"
                    defaultValue={JSON.stringify(defaultJson, null, 2)}
                    theme="my-theme"
                    beforeMount={(monaco) => {
                        monaco.editor.defineTheme("my-theme", monacoTheme);
                    }}
                    // onChange={(value) =>
                    //     form.setFieldsValue({
                    //         headerData: value,
                    //     })
                    // }
                />
            </div>
            <div className="pb-6 border border-gray-400 h-screen">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MdEdit className="text-2xl text-[#8F87F7]" />
                        <p className="text-gray-200 text-lg">Edit Fields</p>
                    </div>
                    <button
                        onClick={() => form.submit()}
                        className="bg-[#EF4E39] py-1.5 px-3.5 rounded-md flex items-center gap-2"
                    >
                        <BsHourglassSplit className="text-gray-200" />
                        <span className="text-gray-200 text-sm">
                            Execute step
                        </span>
                    </button>
                </div>
                <div className="px-6">
                    <Form
                        form={form}
                        name="basic"
                        layout="vertical"
                        onFinish={onFinish}
                    ></Form>
                </div>
            </div>
            <div className="">
                <p className="text-gray-200 text-lg pb-5 tracking-[6px] mt-6 mx-6">
                    OUTPUT
                </p>
                <Editor
                    height="85vh"
                    defaultLanguage="json"
                    defaultValue={JSON.stringify(defaultJson, null, 2)}
                    theme="my-theme"
                    beforeMount={(monaco) => {
                        monaco.editor.defineTheme("my-theme", monacoTheme);
                    }}
                    // onChange={(value) =>
                    //     form.setFieldsValue({
                    //         headerData: value,
                    //     })
                    // }
                />
            </div>
        </div>
    );
};

export default EditFieldsForm;

const defaultJson = {
    base: "vs-dark",
    inherit: true,
    rules: [
        {
            token: "comment",
            foreground: "#888888",
            fontStyle: "italic",
        },
        {
            token: "keyword",
            foreground: "#FF0000",
        },
        {
            token: "string",
            foreground: "#00FF00",
        },
        {
            token: "variable",
            foreground: "#FFA500",
        },
        {
            token: "function",
            foreground: "#0000FF",
            fontStyle: "bold",
        },
    ],
    colors: {
        "editor.background": "#1E1E1E",
        "editor.foreground": "#D4D4D4",
        "editorCursor.foreground": "#00FF00",
        "editor.lineHighlightBackground": "#2A2A2A",
        "editor.selectionBackground": "#4D4D4D",
        "editor.selectionHighlightBackground": "#3C3C3C",
        "editor.findMatchBackground": "#FF00FF",
        "editor.findMatchHighlightBackground": "#FF00FF80",
        "editor.wordHighlightBackground": "#FF8000",
        "editor.wordHighlightStrongBackground": "#FF4000",
        "editor.hoverHighlightBackground": "#00FFFF",
    },
};

const monacoTheme = {
    base: "vs",
    inherit: true,
    rules: [
        { token: "", foreground: "FFFFFF" }, // Default text color (white)
        {
            token: "string.key.json",
            foreground: "FFFFFF",
        }, // JSON key color (white)
        {
            token: "string.value.json",
            foreground: "FFFFFF",
        }, // JSON value color (white)
        {
            token: "delimiter.colon.json",
            foreground: "AAAAAA",
        }, // Colon color (light gray)
        {
            token: "delimiter.bracket",
            foreground: "87CEEB",
        }, // Curly braces color (light blue)
        {
            token: "delimiter.parenthesis",
            foreground: "87CEEB",
        }, // Parentheses color (light blue)
        {
            token: "delimiter.square",
            foreground: "AAAAAA",
        }, // Square brackets color (light gray)
    ],
    colors: {
        "editor.background": "#414244", // Background color
        "editor.foreground": "#FFFFFF", // Default foreground color
        "editorCursor.foreground": "#FFFFFF", // Cursor color
        "editor.selectionBackground": "#3A3B3C", // Selection background
        "editor.lineHighlightBackground": "#2D2E2E", // Line highlight background
    },
};
