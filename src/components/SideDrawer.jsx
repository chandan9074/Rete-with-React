import React from "react";
import { CiGlobe } from "react-icons/ci";
import { FaClock, FaMousePointer, FaRobot } from "react-icons/fa";
import { SiGooglesheets } from "react-icons/si";
import { Button, Drawer } from "antd";

const SideDrawer = ({ open, setOpen }) => {
    const [childrenDrawer, setChildrenDrawer] = React.useState(false);

    // Handlers for closing the drawers
    const onClose = () => setOpen(false);
    const onChildrenDrawerClose = () => setChildrenDrawer(false);
    const showChildrenDrawer = () => setChildrenDrawer(true);

    return (
        <Drawer width={420} closable={false} onClose={onClose} open={open}>
            <div className="w-full h-full bg-[#414244]">
                <div className="p-4 bg-[#525456]">
                    <p className="text-neutral-200 text-lg font-semibold">
                        What happens next?
                    </p>
                </div>
            </div>
            <Drawer
                title="Two-level Drawer"
                width={420}
                closable={false}
                onClose={onChildrenDrawerClose}
                open={childrenDrawer}
            >
                This is two-level drawer
            </Drawer>
        </Drawer>
    );
};

export default SideDrawer;

const data = [
    {
        id: "0",
        label: "Trigger manually",
        description: "Trigger the workflow manually",
        icon: <FaMousePointer className="text-5xl text-gray-300" />,
    },
    {
        id: "1",
        label: "On a schedule",
        description: "Trigger the workflow on a schedule",
        icon: <FaClock className="text-5xl text-gray-300" />,
    },
    {
        id: "2",
        label: "AI",
        description: "Build autonomous agents, etc",
        icon: <FaRobot className="text-5xl text-gray-300" />,
        children: [
            {
                id: "2.1",
                label: "Ai Agent",
                description: "Create an AI agent",
                icon: <FaRobot className="text-5xl text-gray-300" />,
            },
        ],
    },
    {
        id: "3",
        label: "Action in an app",
        description: "Perform an action in an app",
        icon: <CiGlobe className="text-5xl text-gray-300" />,
        children: [
            {
                id: "3.1",
                label: "Google Sheet Node",
                description: "Read and write data to Google Sheets",
                icon: <SiGooglesheets className="text-5xl text-gray-300" />,
            },
        ],
    },
    {
        id: "4",
        label: "Core",
        description: "Core nodes for data manipulation",
        icon: <FaRobot className="text-5xl text-gray-300" />,
        children: [
            {
                id: "4.1",
                label: "Aggregate Node",
                description: "Aggregate data from multiple sources",
                icon: <FaRobot className="text-5xl text-gray-300" />,
            },
        ],
    },
];
