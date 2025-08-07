import { Editor } from "@monaco-editor/react";
import { Form, Input, Select, Switch } from "antd";
import React, { useEffect, useRef } from "react";
import { BsHourglassSplit } from "react-icons/bs";
import { CiGlobe } from "react-icons/ci";

const HttpRequestJSONForm = ({
    data,
    setNodeList,
    nodeList,
    handleSubmit,
    handleFormDrawerClose,
}) => {
    const [form] = Form.useForm();
    const [switchData, setSwitchData] = React.useState({
        isQuery: false,
        isHeaders: false,
        isBody: false,
    });
    const [initialValues, setInitialValues] = React.useState({});
    console.log(data);

    const editorRef = useRef(null);

    useEffect(() => {
        // Format the editor content once it's loaded and set the value
        if (editorRef.current) {
            editorRef.current.getAction("editor.action.formatDocument").run();
        }
    }, []);

    const onFinish = (values) => {
        const updatedNodeList = nodeList?.data?.map((node) => {
            if (node.id === data.id) {
                const parseData = JSON.parse(values.json);

                return {
                    id: parseData.id,
                    slug: parseData.slug,
                    x: parseData?.x,
                    y: parseData.y,
                    inputs: node.inputs,
                    outputs: node.outputs,
                    ...(parseData.formData && { formData: parseData.formData }),
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
        handleFormDrawerClose();
        console.log(JSON.parse(values.json));
    };

    // console.log({ data })

    useEffect(() => {
        if (data) {
            const filterData = nodeList?.data?.find(
                (node) => node.id === data.id
            );
            if (filterData) {
                const formattedJson = JSON.stringify(filterData, null, 2);
                form.setFieldsValue({
                    json: formattedJson,
                });
                setInitialValues({
                    json: formattedJson,
                });
            }
        }
    }, [data]);

    return (
        <div className="pb-6">
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <CiGlobe className="text-2xl text-[#8F87F7]" />
                    <p className="text-gray-200 text-lg">Http Request</p>
                </div>
                <button
                    onClick={() => form.submit()}
                    className="bg-[#EF4E39] py-1.5 px-3.5 rounded-md flex items-center gap-2"
                >
                    <BsHourglassSplit className="text-gray-200" />
                    <span className="text-gray-200 text-sm">Save</span>
                </button>
            </div>
            <div className="px-6">
                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <div className="pb-3">
                        <p className="text-sm text-gray-200 mb-3">JSON</p>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: "Please input json!",
                                },
                            ]}
                            name="json"
                        >
                            <Editor
                                height="550px"
                                defaultLanguage="json"
                                value={initialValues.json}
                                theme="vs-dark"
                                onChange={(value) =>
                                    form.setFieldsValue({
                                        json: value,
                                    })
                                }
                                onMount={(editor, monaco) => {
                                    editorRef.current = editor; // Reference to Monaco editor instance
                                }}
                            />
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default HttpRequestJSONForm;
