import { Editor } from "@monaco-editor/react";
import { Form, Input, Select } from "antd";
import React, { useEffect } from "react";
import { BsHourglassSplit } from "react-icons/bs";
import { MdOutlineWebhook } from "react-icons/md";
import { monacoTheme } from "../../helpers/editorThemeConfig";
import { BACKEND_BASE_URL } from "../../constants/ApiUrl";

// Default JSON structure for webhook body
const defaultWebhookBody = JSON.stringify(
    {
        message: "Hello from webhook",
        data: {},
    },
    null,
    2
);

const WebhookForm = ({
    data,
    setNodeList,
    nodeList,
    handleSubmit,
    handleUpdateWorkflow,
    handleSingleNodeExecution,
    handleFormDrawerClose,
    nodeInputOutputs,
    executeLoading,
}) => {
    const [form] = Form.useForm();
    const [buttonType, setButtonType] = React.useState("");
    const [bodyJson, setBodyJson] = React.useState(defaultWebhookBody);

    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id"); // Get the 'id' query parameter

    // Generate webhook URL automatically
    const webhookUrl = `${BACKEND_BASE_URL}/api/1.0.0/workflows/webhook/${id}`;

    console.log({ data });
    console.log(nodeInputOutputs, "nodeInputOutputs");

    useEffect(() => {
        if (data && nodeList?.data?.length > 0) {
            const currentNode = nodeList.data.find(
                (node) => node.id === data.id
            );
            if (currentNode) {
                const { formData } = currentNode;
                form.setFieldsValue({
                    webhookUrl: webhookUrl,
                });
                setBodyJson(formData?.bodyJson || defaultWebhookBody);
            }
        } else {
            // Set webhook URL even if no existing data
            form.setFieldsValue({
                webhookUrl: webhookUrl,
            });
        }
    }, [data, nodeList, webhookUrl]);

    const onFinish = async (values) => {
        console.log(data.id, "data.id in onFinish");
        console.log(nodeList, "nodeList in onFinish");
        const updatedNodeList = nodeList?.data?.map((node) => {
            if (node.id === data.id) {
                return {
                    ...node,
                    formData: {
                        webhookUrl: webhookUrl,
                        bodyJson: bodyJson,
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

        if (buttonType === "execute") {
            if (id) {
                const updatedData = await handleUpdateWorkflow(updatedNodeList);
                console.log("Updated Data:", updatedData, data);
                const filteredData = updatedData?.nodes?.find(
                    (node) => node.frontendId === data.id
                );
                console.log(filteredData, "filteredData in onFinish");

                const res = await handleSingleNodeExecution(
                    filteredData.id,
                    filteredData.frontendId
                );

                console.log(res, "res in onFinish");
            }
        } else if (buttonType === "save") {
            await handleUpdateWorkflow(updatedNodeList);
        }
        console.log(values);
    };

    return (
        <div className="grid grid-cols-2">
            <div className="pb-6 h-screen overflow-auto">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MdOutlineWebhook className="text-2xl text-[#E7EBF3]" />
                        <p className="text-gray-200 text-lg">Webhook</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setButtonType("execute");
                                form.submit();
                            }}
                            className="bg-[#EF4E39] py-1.5 px-3.5 rounded-md flex items-center gap-2 cursor-pointer"
                        >
                            <BsHourglassSplit
                                className={`text-gray-200 ${
                                    executeLoading && "animate-spin"
                                }`}
                            />
                            <span className="text-gray-200 text-sm">
                                Execute Step
                            </span>
                        </button>
                        <button
                            onClick={() => {
                                setButtonType("save");
                                form.submit();
                            }}
                            className="bg-[#EF4E39] py-1.5 px-3.5 rounded-md flex items-center gap-2 cursor-pointer"
                        >
                            <span className="text-gray-200 text-sm">Save</span>
                        </button>
                    </div>
                </div>
                <div className="px-6">
                    <Form
                        form={form}
                        name="basic"
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    Webhook URL
                                </p>
                            }
                            name="webhookUrl"
                        >
                            <Input
                                readOnly
                                style={{
                                    backgroundColor: "#1a1a1a",
                                    border: "1px solid #5b5c5c",
                                    color: "#f4f4f4",
                                    cursor: "default",
                                }}
                                value={webhookUrl}
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    Body JSON
                                </p>
                            }
                        >
                            <div className="border border-[#5b5c5c] rounded">
                                <Editor
                                    height="200px"
                                    defaultLanguage="json"
                                    value={bodyJson}
                                    theme="my-theme"
                                    onChange={(value) =>
                                        setBodyJson(value || defaultWebhookBody)
                                    }
                                    beforeMount={(monaco) => {
                                        monaco.editor.defineTheme(
                                            "my-theme",
                                            monacoTheme
                                        );
                                    }}
                                    options={{
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        fontSize: 14,
                                        lineNumbers: "on",
                                        folding: true,
                                        wordWrap: "on",
                                    }}
                                />
                            </div>
                        </Form.Item>
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
                    value={JSON.stringify(
                        nodeInputOutputs.find((node) => node.id === data.id)
                            ?.output || {},
                        null,
                        2
                    )}
                    theme="my-theme"
                    beforeMount={(monaco) => {
                        monaco.editor.defineTheme("my-theme", monacoTheme);
                    }}
                />
            </div>
        </div>
    );
};

export default WebhookForm;
