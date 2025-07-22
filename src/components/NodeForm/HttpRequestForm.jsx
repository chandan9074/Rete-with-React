import { Form, Input, Select, Switch } from "antd";
import React from "react";
import { CiGlobe } from "react-icons/ci";

const HttpRequestForm = ({ data }) => {
    console.log(data);

    const onFinish = (values) => {};

    return (
        <div>
            <div className="p-6 flex items-center gap-3">
                <CiGlobe className="text-2xl text-[#8F87F7]" />
                <p className="text-gray-200 text-lg">Http Request</p>
            </div>
            <div className="px-6">
                <Form name="basic" layout="vertical" onFinish={onFinish}>
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
                        {/* <Input
                            style={{
                                backgroundColor: "#2D2E2E",
                                border: "1px solid #5b5c5c",
                                color: "#f4f4f4",
                            }}
                            className="bg-[#f4f4f4]"
                        /> */}
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
                        label={<p className="text-sm text-gray-200">URL</p>}
                        name="url"
                        rules={[
                            {
                                required: true,
                                message: "Please input your url!",
                            },
                        ]}
                    >
                        <Switch defaultChecked />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default HttpRequestForm;
