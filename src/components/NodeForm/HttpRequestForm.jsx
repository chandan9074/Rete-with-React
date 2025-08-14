import { Editor } from "@monaco-editor/react";
import { Form, Input, Select, Switch } from "antd";
import React, { useEffect } from "react";
import { BsHourglassSplit } from "react-icons/bs";
import { CiGlobe } from "react-icons/ci";
import { defaultJson, monacoTheme } from "../../helpers/editorThemeConfig";

const HttpRequestForm = ({
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
        isQuery: false,
        isHeaders: false,
        isBody: false,
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
                    method: formData?.method || "GET",
                    url: formData?.url || "",
                    query: formData?.query || "",
                    headers: formData?.headers || "",
                    body: formData?.body || "",
                });
                setSwitchData({
                    isQuery: !!formData?.query,
                    isHeaders: !!formData?.headers,
                    isBody: !!formData?.body,
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
                        method: values.method,
                        url: values.url,
                        ...(switchData.isQuery && { query: values.query }),
                        ...(switchData.isHeaders && {
                            headers: values.headers,
                        }),
                        ...(switchData.isBody && { body: values.body }),
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
        // handleSubmit(updatedNodeList);
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
        // handleFormDrawerClose();
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
                    // onChange={(value) =>
                    //     form.setFieldsValue({
                    //         headerData: value,
                    //     })
                    // }
                />
            </div>
            <div className="pb-6 h-screen overflow-auto">
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CiGlobe className="text-2xl text-[#8F87F7]" />
                        <p className="text-gray-200 text-lg">Http Request</p>
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
                                <p className="text-sm text-gray-200">Method</p>
                            }
                            name="method"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select method!",
                                },
                            ]}
                        >
                            <Select
                                dropdownStyle={{ backgroundColor: "#2D2E2E" }}
                                options={[
                                    {
                                        value: "GET",
                                        label: "GET",
                                    },
                                    {
                                        value: "POST",
                                        label: "POST",
                                    },
                                ]}
                                style={{
                                    background: "#2D2E2E",
                                    border: "1px solid #5b5c5c",
                                    color: "#f4f4f4",
                                }}
                                rootClassName="bg-black"
                                placeholder="Select Method"
                            />
                        </Form.Item>
                        <Form.Item
                            label={<p className="text-sm text-gray-200">URL</p>}
                            name="url"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your url!",
                                },
                            ]}
                        >
                            <Input
                                style={{
                                    backgroundColor: "#2D2E2E",
                                    border: "1px solid #5b5c5c",
                                    color: "#f4f4f4",
                                }}
                                className="bg-[#f4f4f4]"
                                placeholder="https://example.com/api"
                            />
                        </Form.Item>
                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    Send Query Parameters
                                </p>
                            }
                            name="isQuery"
                        >
                            <Switch
                                // value={switchData.isQuery}
                                checked={switchData.isQuery}
                                onChange={(value) =>
                                    setSwitchData((prev) => ({
                                        ...prev,
                                        isQuery: value,
                                    }))
                                }
                            />
                        </Form.Item>
                        {switchData.isQuery && (
                            <div className="pb-3">
                                <p className="text-sm text-gray-200 mb-3">
                                    JSON
                                </p>
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please input Query Parameters!",
                                        },
                                    ]}
                                    name="query"
                                >
                                    <Editor
                                        height="150px"
                                        defaultLanguage="json"
                                        theme="vs-dark"
                                        onChange={(value) =>
                                            form.setFieldsValue({
                                                query: value,
                                            })
                                        }
                                    />
                                </Form.Item>
                            </div>
                        )}
                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    Send Headers
                                </p>
                            }
                            name="isHeaders"
                        >
                            <Switch
                                // value={switchData.isHeaders}
                                checked={switchData.isHeaders}
                                onChange={(value) =>
                                    setSwitchData((prev) => ({
                                        ...prev,
                                        isHeaders: value,
                                    }))
                                }
                            />
                        </Form.Item>
                        {switchData.isHeaders && (
                            <div className="pb-3">
                                <p className="text-sm text-gray-200 mb-3">
                                    JSON
                                </p>
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input headers!",
                                        },
                                    ]}
                                    name="headers"
                                >
                                    <Editor
                                        height="150px"
                                        defaultLanguage="json"
                                        theme="vs-dark"
                                        onChange={(value) =>
                                            form.setFieldsValue({
                                                headers: value,
                                            })
                                        }
                                    />
                                </Form.Item>
                            </div>
                        )}
                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    Send Body
                                </p>
                            }
                            name="isBody"
                        >
                            <Switch
                                // value={switchData.isBody}
                                checked={switchData.isBody}
                                onChange={(value) =>
                                    setSwitchData((prev) => ({
                                        ...prev,
                                        isBody: value,
                                    }))
                                }
                            />
                        </Form.Item>
                        {switchData.isBody && (
                            <div className="pb-3">
                                <p className="text-sm text-gray-200 mb-3">
                                    JSON
                                </p>
                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please input body!",
                                        },
                                    ]}
                                    name="body"
                                >
                                    <Editor
                                        height="150px"
                                        defaultLanguage="json"
                                        theme="vs-dark"
                                        onChange={(value) =>
                                            form.setFieldsValue({
                                                body: value,
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

export default HttpRequestForm;
