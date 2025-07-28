import { Editor } from "@monaco-editor/react";
import { Button, Form, Input, Select, Switch } from "antd";
import React, { use } from "react";
import { BsHourglassSplit } from "react-icons/bs";
import { CiGlobe } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";

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
        console.log(values);
        const updatedNodeList = nodeList?.data?.map((node) => {
            if (node.id === data.id) {
                return {
                    ...node,
                    formData: {
                        editFields: values.editFields,
                    },
                };
            }
            return node;
        });
        // console.log("Updated Node List:", updatedNodeList);
        setNodeList((prev) => ({
            ...prev,
            data: updatedNodeList,
        }));
        handleSubmit(updatedNodeList);
    };

    return (
        <div className="grid grid-cols-3">
            <div className="">
                <p className="text-gray-200 text-lg pb-5 tracking-[6px] mt-6 mx-6">
                    INPUT
                </p>
                <Editor
                    options={{
                        readOnly: true,
                    }}
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
            <div className="pb-6  h-screen overflow-auto">
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
                    >
                        <Form.List name="editFields">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((_a) => {
                                        let { key, name } = _a;
                                        return (
                                            <div className="relative shadow-[0_10px_15px_rgba(0,0,0,0.25)] p-4 mb-6 group">
                                                <Form.Item
                                                    label={
                                                        <p className="text-gray-200 text-sm">
                                                            Name
                                                        </p>
                                                    }
                                                    name={[name, "name"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Missing name",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        style={{
                                                            backgroundColor:
                                                                "#2D2E2E",
                                                            border: "1px solid #5b5c5c",
                                                            color: "#f4f4f4",
                                                        }}
                                                        className="bg-[#f4f4f4]"
                                                        placeholder="Name"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label={
                                                        <p className="text-gray-200 text-sm">
                                                            Type
                                                        </p>
                                                    }
                                                    name={[name, "type"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Missing type",
                                                        },
                                                    ]}
                                                >
                                                    <Select
                                                        dropdownStyle={{
                                                            backgroundColor:
                                                                "#2D2E2E",
                                                        }}
                                                        options={[
                                                            {
                                                                value: "String",
                                                                label: "String",
                                                            },
                                                            {
                                                                value: "Number",
                                                                label: "Number",
                                                            },
                                                            {
                                                                value: "Boolean",
                                                                label: "Boolean",
                                                            },
                                                            {
                                                                value: "Array",
                                                                label: "Array",
                                                            },
                                                            {
                                                                value: "Object",
                                                                label: "Object",
                                                            },
                                                        ]}
                                                        style={{
                                                            background:
                                                                "#2D2E2E",
                                                            border: "1px solid #5b5c5c",
                                                            color: "#f4f4f4",
                                                        }}
                                                        rootClassName="bg-black"
                                                        placeholder="Select Type"
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label={
                                                        <p className="text-gray-200 text-sm">
                                                            Value
                                                        </p>
                                                    }
                                                    name={[name, "value"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Missing value",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        style={{
                                                            backgroundColor:
                                                                "#2D2E2E",
                                                            border: "1px solid #5b5c5c",
                                                            color: "#f4f4f4",
                                                        }}
                                                        className="bg-[#f4f4f4]"
                                                        placeholder="Value"
                                                    />
                                                </Form.Item>
                                                <button
                                                    onClick={() => remove(name)}
                                                    type="button"
                                                    className="absolute top-1.5 right-1.5 p-1 cursor-pointer group-hover:block hidden"
                                                >
                                                    <MdDelete className="text-xl text-red-500" />
                                                </button>
                                                {/* <MinusCircleOutlined onClick={() => remove(name)} /> */}
                                            </div>
                                        );
                                    })}
                                    <Form.Item>
                                        <button
                                            onClick={() => add()}
                                            type="button"
                                            className="w-full bg-neutral-500 mt-3 py-2 rounded-md"
                                        >
                                            Add field
                                        </button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Form>
                </div>
            </div>
            <div className="">
                <p className="text-gray-200 text-lg pb-5 tracking-[6px] mt-6 mx-6">
                    OUTPUT
                </p>
                <Editor
                    options={{
                        readOnly: true,
                    }}
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
