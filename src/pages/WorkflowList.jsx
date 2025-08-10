// WorkflowList.jsx
import React, {useEffect, useState} from "react";
import {message, Table} from "antd";
import axios from "axios";
import {MdDelete, MdEdit} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import {WORKFLOW_DELETE_BY_ID, WORKFLOW_LIST} from "../constants/ApiUrl.js";

const WorkflowList = () => {
    const [workflowList, setWorkflowList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWorkflowList();
    }, []);

    const fetchWorkflowList = async () => {
        const res = await axios.get(
            WORKFLOW_LIST,
            {
                params: {
                    size: 1000,
                    page: 0,
                },
            }
        );
        setWorkflowList(res?.data?.content);
    };

    const deleteWorkflow = async (id) => {
        try {
            await axios.delete(
                `${WORKFLOW_DELETE_BY_ID}/${id}`
            );
            message.success("Workflow deleted successfully");
            // Remove the deleted workflow from the state
            fetchWorkflowList();
        } catch (error) {
            message.error("Failed to delete workflow");
        }
    };

    // Define table columns
    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, data) => (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(`/workflow?id=${data.id}`)}
                        className="bg-[#EF4E39] p-2 rounded-md cursor-pointer"
                    >
                        <MdEdit className="text-white text-base"/>
                    </button>
                    <button
                        onClick={() => deleteWorkflow(data.id)}
                        className="bg-[#EF4E39] p-2 rounded-md cursor-pointer"
                    >
                        <MdDelete className="text-white text-base"/>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-16 bg-[#2D2E2E] h-screen overflow-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-gray-200 text-2xl font-semibold">
                    Workflow List
                </h1>
                <button
                    onClick={() => navigate("/workflow")}
                    className=" bg-[#FF6F5C] hover:bg-[#EF4E39] duration-300 py-2.5 px-5 rounded-md items-center gap-2 flex cursor-pointer"
                >
                    <span className="text-gray-200 text-sm font-semibold whitespace-nowrap">
                        Create Workflow
                    </span>
                </button>
            </div>
            <Table columns={columns} dataSource={workflowList}/>
        </div>
    );
};

export default WorkflowList;
