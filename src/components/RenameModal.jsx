import { Form, Input, Modal } from "antd";
import React, { use, useEffect } from "react";

const RenameModal = ({
    nodeList,
    setNodeList,
    openRenameModal,
    setOpenRenameModal,
    handleRenameNode,
}) => {
    const [form] = Form.useForm();
    console.log(nodeList, openRenameModal, "nodeList in RenameModal");

    useEffect(() => {
        if (openRenameModal) {
            const nodeData = nodeList.data.find(
                (item) => item.id === openRenameModal.id
            );

            console.log(nodeData, "nodeData in RenameModal");
            form.setFieldsValue({
                name: nodeData ? nodeData.label : "",
            });
        }
    }, [openRenameModal]);

    const onFinish = (values) => {
        console.log({ values });
        setNodeList((node) => {
            const updatedNodeList = node.data.map((item) => {
                if (item.id === openRenameModal.id) {
                    return { ...item, label: values.name };
                }
                return item;
            });
            return { ...node, data: updatedNodeList };
        });
        handleRenameNode(openRenameModal.id, values.name);
        setOpenRenameModal(null);
    };

    return (
        <Modal
            title={null}
            footer={null}
            closable={{ "aria-label": "Custom Close Button" }}
            open={!!openRenameModal}
            onCancel={() => setOpenRenameModal(null)}
        >
            <p className="text-gray-200 text-lg pb-6">Rename Node</p>
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
                <button
                    type="submit"
                    className=" bg-[#FF6F5C] hover:bg-[#EF4E39] duration-300 py-2.5 px-5 rounded-md justify-center gap-2 flex cursor-pointer mt-6 w-full"
                >
                    <span className="text-gray-200 text-sm font-semibold whitespace-nowrap">
                        Save
                    </span>
                </button>
            </Form>
        </Modal>
    );
};

export default RenameModal;
