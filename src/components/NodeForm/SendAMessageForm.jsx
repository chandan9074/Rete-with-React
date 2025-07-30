import { Editor } from "@monaco-editor/react";
import { Button, Form, Input, Select, Switch } from "antd";
import React, { use } from "react";
import { BsHourglassSplit } from "react-icons/bs";
import { CiGlobe } from "react-icons/ci";
import { MdDelete, MdEdit } from "react-icons/md";
import { defaultJson, monacoTheme } from "../../helpers/editorThemeConfig";
import Icons from "../../assets";

const SendAMessageForm = ({ data, setNodeList, nodeList, handleSubmit }) => {
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
                        <img
                            src={Icons.gmail}
                            alt="gmail"
                            className="w-5 h-5 select-none"
                            draggable="false"
                        />
                        <p className="text-gray-200 text-lg">Send a message</p>
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
                <div className="p-6">
                    <Form
                        form={form}
                        name="basic"
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    Credential to connect with
                                </p>
                            }
                            name="credential"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select credential!",
                                },
                            ]}
                        >
                            <Select
                                dropdownStyle={{ backgroundColor: "#2D2E2E" }}
                                style={{
                                    background: "#2D2E2E",
                                    border: "1px solid #5b5c5c",
                                    color: "#f4f4f4",
                                }}
                                rootClassName="bg-black"
                                placeholder="Select Credential"
                                dropdownRender={(menu) => (
                                    <div>
                                        {menu}
                                        <div
                                            style={{
                                                padding: "8px",
                                                textAlign: "center",
                                            }}
                                        >
                                            <button
                                                type="link"
                                                onClick={() =>
                                                    console.log("clicked")
                                                }
                                                // onClick={handleAddOptionClick}
                                                style={{ padding: 0 }}
                                            >
                                                Add Option
                                            </button>
                                        </div>
                                    </div>
                                )}
                            >
                                <Select.Option value="gmail">
                                    <p className="hover:text-[#FF6F5C] font-semibold duration-300">
                                        Gmail
                                    </p>
                                </Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={<p className="text-sm text-gray-200">To</p>}
                            name="to"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your email!",
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
                                placeholder="info@example.com"
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
                                    message: "Please input your subject!",
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
                                placeholder="Hello World!"
                            />
                        </Form.Item>
                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">
                                    Email Type
                                </p>
                            }
                            name="emailType"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select email type!",
                                },
                            ]}
                        >
                            <Select
                                dropdownStyle={{ backgroundColor: "#2D2E2E" }}
                                options={[
                                    {
                                        value: "HTML",
                                        label: "HTML",
                                    },
                                    {
                                        value: "Text",
                                        label: "Text",
                                    },
                                ]}
                                style={{
                                    background: "#2D2E2E",
                                    border: "1px solid #5b5c5c",
                                    color: "#f4f4f4",
                                }}
                                rootClassName="bg-black"
                                placeholder="Select type"
                            />
                        </Form.Item>
                        <Form.Item
                            label={
                                <p className="text-sm text-gray-200">Message</p>
                            }
                            name="message"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your message!",
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
                                placeholder="Write..."
                            />
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

export default SendAMessageForm;
