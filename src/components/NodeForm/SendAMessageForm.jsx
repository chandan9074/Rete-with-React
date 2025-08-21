import { Editor } from "@monaco-editor/react";
import { Button, Form, Input, Select, Switch } from "antd";
import React, { useEffect } from "react";
import { BsHourglassSplit } from "react-icons/bs";
import { defaultJson, monacoTheme } from "../../helpers/editorThemeConfig";
import Icons from "../../assets";

const SendAMessageForm = ({
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
    const [switchData, setSwitchData] = React.useState({
        secure: false,
        isHtml: false,
    });
    const [buttonType, setButtonType] = React.useState("");

    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id"); // Get the 'id' query parameter

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
                    smtpHost: formData?.smtpHost || "",
                    smtpPort: formData?.smtpPort || 587,
                    secure: formData?.secure || false,
                    user: formData?.user || "",
                    pass: formData?.pass || "",
                    from: formData?.from || "",
                    to: formData?.to || "",
                    subject: formData?.subject || "",
                    text: formData?.text || "",
                    html: formData?.html || "",
                });
                setSwitchData({
                    secure: formData?.secure || false,
                    isHtml: !!formData?.html,
                });
            }
        }
    }, [data, nodeList]);

    const onFinish = async (values) => {
        console.log(data.id, "data.id in onFinish");
        console.log(nodeList, "nodeList in onFinish");
        const updatedNodeList = nodeList?.data?.map((node) => {
            if (node.id === data.id) {
                return {
                    ...node,
                    formData: {
                        smtpHost: values.smtpHost,
                        smtpPort: values.smtpPort,
                        secure: switchData.secure,
                        user: values.user,
                        pass: values.pass,
                        from: values.from,
                        to: values.to,
                        subject: values.subject,
                        text: values.text,
                        ...(switchData.isHtml && { html: values.html }),
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
                    value={JSON.stringify(
                        nodeInputOutputs.find((node) => node.id === data.id)
                            ?.input || {},
                        null,
                        2
                    )}
                    theme="my-theme"
                    beforeMount={(monaco) => {
                        monaco.editor.defineTheme("my-theme", monacoTheme);
                    }}
                />
            </div>
            <div className="pb-6 h-screen overflow-auto">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img
                            src={Icons.gmail}
                            alt="gmail"
                            className="w-5 h-5 select-none"
                            draggable="false"
                        />
                        <p className="text-gray-200 text-lg">Send a message</p>
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
                        {/* SMTP Configuration */}
                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    SMTP Host
                                </p>
                            }
                            name="smtpHost"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input SMTP host!",
                                },
                            ]}
                        >
                            <Input
                                style={{
                                    backgroundColor: "#2D2E2E",
                                    border: "1px solid #5b5c5c",
                                    color: "#f4f4f4",
                                }}
                                placeholder="smtp.gmail.com"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    SMTP Port
                                </p>
                            }
                            name="smtpPort"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input SMTP port!",
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                style={{
                                    backgroundColor: "#2D2E2E",
                                    border: "1px solid #5b5c5c",
                                    color: "#f4f4f4",
                                }}
                                placeholder="587"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    Secure Connection (TLS/SSL)
                                </p>
                            }
                            name="secure"
                        >
                            <Switch
                                checked={switchData.secure}
                                onChange={(value) =>
                                    setSwitchData((prev) => ({
                                        ...prev,
                                        secure: value,
                                    }))
                                }
                            />
                        </Form.Item>

                        {/* Authentication */}
                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    Username
                                </p>
                            }
                            name="user"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input username!",
                                },
                            ]}
                        >
                            <Input
                                style={{
                                    backgroundColor: "#2D2E2E",
                                    border: "1px solid #5b5c5c",
                                    color: "#f4f4f4",
                                }}
                                placeholder="user@example.com"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    Password
                                </p>
                            }
                            name="pass"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input password!",
                                },
                            ]}
                        >
                            <Input.Password
                                style={{
                                    backgroundColor: "#2D2E2E",
                                    border: "1px solid #5b5c5c",
                                    color: "#f4f4f4",
                                }}
                                placeholder="Enter password"
                            />
                        </Form.Item>

                        {/* Email Content */}
                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">From</p>
                            }
                            name="from"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input sender email!",
                                },
                            ]}
                        >
                            <Input
                                style={{
                                    backgroundColor: "#2D2E2E",
                                    border: "1px solid #5b5c5c",
                                    color: "#f4f4f4",
                                }}
                                placeholder="sender@example.com"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<p className="text-sm text-gray-200">To</p>}
                            name="to"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input recipient email!",
                                },
                            ]}
                        >
                            <Input
                                style={{
                                    backgroundColor: "#2D2E2E",
                                    border: "1px solid #5b5c5c",
                                    color: "#f4f4f4",
                                }}
                                placeholder="recipient@example.com"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">Subject</p>
                            }
                            name="subject"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input email subject!",
                                },
                            ]}
                        >
                            <Input
                                style={{
                                    backgroundColor: "#2D2E2E",
                                    border: "1px solid #5b5c5c",
                                    color: "#f4f4f4",
                                }}
                                placeholder="Email Subject"
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    Text Content
                                </p>
                            }
                            name="text"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input email text content!",
                                },
                            ]}
                        >
                            <Input.TextArea
                                rows={4}
                                style={{
                                    backgroundColor: "#2D2E2E",
                                    border: "1px solid #5b5c5c",
                                    color: "#f4f4f4",
                                }}
                                placeholder="Enter email text content..."
                            />
                        </Form.Item>

                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    Send HTML Content
                                </p>
                            }
                            name="isHtml"
                        >
                            <Switch
                                checked={switchData.isHtml}
                                onChange={(value) =>
                                    setSwitchData((prev) => ({
                                        ...prev,
                                        isHtml: value,
                                    }))
                                }
                            />
                        </Form.Item>

                        {switchData.isHtml && (
                            <div className="pb-3">
                                <p className="text-sm text-gray-200 mb-3">
                                    HTML Content
                                </p>
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input HTML content!",
                                        },
                                    ]}
                                    name="html"
                                >
                                    <Editor
                                        height="200px"
                                        defaultLanguage="html"
                                        theme="vs-dark"
                                        onChange={(value) =>
                                            form.setFieldsValue({
                                                html: value,
                                            })
                                        }
                                    />
                                </Form.Item>
                            </div>
                        )}
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

export default SendAMessageForm;
