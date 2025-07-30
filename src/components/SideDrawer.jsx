import React from "react";
import { CiGlobe } from "react-icons/ci";
import { FaClock, FaFileExport, FaMousePointer, FaRobot } from "react-icons/fa";
import { SiGmail, SiGooglesheets } from "react-icons/si";
import { Button, Drawer } from "antd";
import { TiArrowRight } from "react-icons/ti";
import { MdEdit, MdOutlineWebhook } from "react-icons/md";
import { BiCodeCurly } from "react-icons/bi";
import Icons from "../assets";

const SideDrawer = ({ open, setOpen, handleSubmit }) => {
    const [childrenDrawer, setChildrenDrawer] = React.useState(false);
    const [childrenData, setChildrenData] = React.useState([]);

    // Handlers for closing the drawers
    const onClose = () => setOpen(false);
    const onChildrenDrawerClose = () => setChildrenDrawer(false);
    const showChildrenDrawer = () => setChildrenDrawer(true);

    const handleParentItemClick = (item) => {
        // If the item has children, open the children drawer
        console.log({ item });
        if (item.children) {
            showChildrenDrawer();
            setChildrenData(item);
        } else {
            // Handle the case when there are no children
            handleSubmit(item);
            setOpen(false);
            setChildrenDrawer(false);
        }
    };

    return (
        <Drawer width={420} closable={false} onClose={onClose} open={open}>
            <div className="w-full h-full bg-[#414244]">
                <div className="p-4 bg-[#525456]">
                    <p className="text-neutral-200 text-lg font-semibold">
                        What happens next?
                    </p>
                </div>
                <div className="mt-3">
                    {data.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[#4e4f52] duration-300 cursor-pointer"
                            onClick={() => handleParentItemClick(item)}
                        >
                            <div className="flex items-center gap-4">
                                {item.icon}
                                <div className="flex flex-col">
                                    <p className="text-base text-gray-200">
                                        {item.label}
                                    </p>
                                    <p className="text-base text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                            {item.children && (
                                <TiArrowRight className="text-2xl text-gray-300" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Drawer
                width={420}
                closable={false}
                onClose={onChildrenDrawerClose}
                open={childrenDrawer}
            >
                <div className="w-full h-full bg-[#414244]">
                    <div className="p-4 bg-[#525456] flex items-center gap-3">
                        {childrenData?.icon}
                        <p className="text-neutral-200 text-lg font-semibold mt-0.5">
                            {childrenData?.label || "Select an option"}
                        </p>
                    </div>
                    <div className="mt-3">
                        {childrenData?.children?.length > 0 &&
                            childrenData?.children?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[#4e4f52] duration-300 cursor-pointer"
                                    onClick={() => handleParentItemClick(item)}
                                >
                                    <div className="flex items-center gap-4">
                                        {item.icon}
                                        <div className="flex flex-col">
                                            <p className="text-base text-gray-200">
                                                {item.label}
                                            </p>
                                            <p className="text-base text-gray-400">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    {item.children && (
                                        <TiArrowRight className="text-2xl text-gray-300" />
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            </Drawer>
        </Drawer>
    );
};

export default SideDrawer;

const data = [
    {
        id: "0",
        label: "Trigger manually",
        slug: "triggerManually",
        description: "Trigger the workflow manually",
        icon: <FaMousePointer className="text-xl text-gray-300" />,
    },
    {
        id: "1",
        label: "On a schedule",
        slug: "onASchedule",
        description: "Trigger the workflow on a schedule",
        icon: <FaClock className="text-xl text-gray-300" />,
    },
    {
        id: "2",
        label: "AI",
        slug: "ai",
        description: "Build autonomous agents, etc",
        icon: <FaRobot className="text-xl text-gray-300" />,
        children: [
            {
                id: "2.1",
                label: "Ai Agent",
                slug: "aiAgent",
                description: "Create an AI agent",
                icon: <FaRobot className="text-xl text-gray-300" />,
            },
        ],
    },
    {
        id: "3",
        label: "Action in an app",
        slug: "actionInAnApp",
        description: "Perform an action in an app",
        icon: <CiGlobe className="text-xl text-gray-300" />,
        children: [
            {
                id: "3.1",
                label: "Google Sheet Node",
                slug: "googleSheetNode",
                description: "Read and write data to Google Sheets",
                icon: <SiGooglesheets className="text-xl text-gray-300" />,
            },
            {
                id: "3.1",
                label: "Send a Message",
                slug: "sendAMessage",
                description: "Send a message to a channel",
                icon: <SiGmail className="text-xl text-gray-300" />,
            },
        ],
    },
    {
        id: "4",
        label: "Core",
        slug: "core",
        description: "Core nodes for data manipulation",
        icon: <FaRobot className="text-xl text-gray-300" />,
        children: [
            {
                id: "4.1",
                label: "Code",
                slug: "code",
                description: "Write custom code to manipulate data",
                icon: <BiCodeCurly className="text-xl text-gray-300" />,
            },
            {
                id: "4.2",
                label: "HTTP Request",
                slug: "httpRequest",
                description: "Make HTTP requests to external APIs",
                icon: <CiGlobe className="text-xl text-gray-300" />,
            },
            {
                id: "4.3",
                label: "Webhook",
                slug: "webhook",
                description: "Receive data from external sources",
                icon: <MdOutlineWebhook className="text-xl text-gray-300" />,
            },
        ],
    },
    {
        id: "5",
        label: "Data Transformation",
        slug: "dataTransformation",
        description: "Transform and manipulate data",
        icon: <MdEdit className="text-xl text-gray-300" />,
        children: [
            {
                id: "5.1",
                label: "Code",
                slug: "code",
                description: "Write custom code to manipulate data",
                icon: <BiCodeCurly className="text-xl text-gray-300" />,
            },
            {
                id: "5.2",
                label: "Edit Fields (Set)",
                slug: "editFields",
                description: "Edit fields in a data structure",
                icon: <MdEdit className="text-xl text-gray-300" />,
            },
            {
                id: "5.3",
                label: "Aggregate Node",
                slug: "aggregateNode",
                description: "Aggregate data from multiple sources",
                icon: <FaRobot className="text-xl text-gray-300" />,
            },
            {
                id: "5.4",
                label: "Extract from File",
                slug: "extractFromFile",
                description: "Extract data from files",
                icon: <FaFileExport className="text-xl text-gray-300" />,
            },
        ],
    },
];
