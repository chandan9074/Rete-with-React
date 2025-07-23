import { Editor } from "@monaco-editor/react";
import { Form, Input, Select, Switch } from "antd";
import React from "react";
import { BsHourglassSplit } from "react-icons/bs";
import { CiGlobe } from "react-icons/ci";

const HttpRequestForm = ({ data }) => {
    const [form] = Form.useForm();
    const [switchData, setSwitchData] = React.useState({
        isQuery: false,
        isHeaders: false,
        isBody: false,
    });
    console.log(data);

    const onFinish = (values) => {
        console.log(values);
    };

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
                    <span className="text-gray-200 text-sm">Execute step</span>
                </button>
            </div>
            <div className="px-6">
                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label={<p className="text-sm text-gray-200">Method</p>}
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please select method!",
                            },
                        ]}
                    >
                        <Select
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
                            value={switchData.isQuery}
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
                            <p className="text-sm text-gray-200 mb-3">JSON</p>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Please input Query Parameters!",
                                    },
                                ]}
                                name="queryData"
                            >
                                <Editor
                                    height="150px"
                                    defaultLanguage="json"
                                    theme="vs-dark"
                                    onChange={(value) =>
                                        form.setFieldsValue({
                                            queryData: value,
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
                            value={switchData.isHeaders}
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
                            <p className="text-sm text-gray-200 mb-3">JSON</p>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input headers!",
                                    },
                                ]}
                                name="headerData"
                            >
                                <Editor
                                    height="150px"
                                    defaultLanguage="json"
                                    theme="vs-dark"
                                    onChange={(value) =>
                                        form.setFieldsValue({
                                            headerData: value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </div>
                    )}
                    <Form.Item
                        label={
                            <p className="text-sm text-gray-200">Send Body</p>
                        }
                        name="isBody"
                    >
                        <Switch
                            value={switchData.isBody}
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
                            <p className="text-sm text-gray-200 mb-3">JSON</p>
                            <Form.Item
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input body!",
                                    },
                                ]}
                                name="bodyData"
                            >
                                <Editor
                                    height="150px"
                                    defaultLanguage="json"
                                    theme="vs-dark"
                                    onChange={(value) =>
                                        form.setFieldsValue({
                                            bodyData: value,
                                        })
                                    }
                                />
                            </Form.Item>
                        </div>
                    )}
                </Form>
            </div>
        </div>
    );
};

export default HttpRequestForm;
