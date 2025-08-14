import { Form, Input, message, Modal } from "antd";
import React from "react";
import { WORKFLOW_CREATE } from "../constants/ApiUrl";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateModal = ({ openCreateModal, setOpenCreateModal }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const data = {
                name: values.name,
                ...(values.description && { description: values.description }),
                nodes: [
                    {
                        label: "When clicking 'Execute Workflow'",
                        frontendId: `node${Date.now()}`, // Unique ID
                        x: 0,
                        y: 0,
                        inputs: ["a"],
                        outputs: ["a"],
                        slug: "triggerManually",
                    },
                ],
                connections: [],
            };

            const res = await axios.post(WORKFLOW_CREATE, data);

            message.success("Workflow created successfully");

            navigate(`/workflow?id=${res.data.id}`);
        } catch (error) {
            console.error("Error creating workflow:", error);
            message.error("Failed to create workflow");
        }
    };

    return (
        <Modal
            title={null}
            footer={null}
            closable={{ "aria-label": "Custom Close Button" }}
            open={!!openCreateModal}
            onCancel={() => setOpenCreateModal(null)}
        >
            <p className="text-gray-200 text-lg pb-6">Create Workflow</p>
            <Form
                form={form}
                name="basic"
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label={<p className="text-sm text-gray-200">Name</p>}
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your name!",
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
                        placeholder="xyz"
                    />
                </Form.Item>
                <Form.Item
                    label={<p className="text-sm text-gray-200">Description</p>}
                    name="description"
                >
                    <Input.TextArea
                        style={{
                            backgroundColor: "#2D2E2E",
                            border: "1px solid #5b5c5c",
                            color: "#f4f4f4",
                        }}
                        className="bg-[#f4f4f4]"
                        placeholder="Write..."
                    />
                </Form.Item>
                <button
                    type="submit"
                    className=" bg-[#FF6F5C] hover:bg-[#EF4E39] duration-300 py-2.5 px-5 rounded-md justify-center gap-2 flex cursor-pointer mt-6 w-full"
                >
                    <span className="text-gray-200 text-sm font-semibold whitespace-nowrap">
                        Create
                    </span>
                </button>
            </Form>
        </Modal>
    );
};

export default CreateModal;
