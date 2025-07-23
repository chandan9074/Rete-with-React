import { Editor } from "@monaco-editor/react";
import { Form, Input, Select, Switch } from "antd";
import React from "react";
import { BsHourglassSplit } from "react-icons/bs";
import { CiGlobe } from "react-icons/ci";
import { FaClock } from "react-icons/fa";

const ScheduleTriggerForm = ({ data }) => {
    const [form] = Form.useForm();
    const [switchData, setSwitchData] = React.useState({
        isQuery: false,
        isHeaders: false,
        isBody: false,
    });
    const [selectedTrigger, setSelectedTrigger] = React.useState("");
    console.log(data);

    const onFinish = (values) => {
        console.log(values);
    };

    const formRender = {
        Seconds: <ForSeconds />,
        Minutes: <ForMinutes />,
        Hours: <ForHours />,
        Days: <ForDays />,
        Weeks: <ForWeeks />,
        Months: <ForMonths />,
        "Custom (Corn)": <ForCustom />,
    };

    return (
        <div className="pb-6">
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FaClock className="text-2xl text-[#8F87F7]" />
                    <p className="text-gray-200 text-lg">Schedule Trigger</p>
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
                        label={
                            <p className="text-sm text-gray-200">
                                Trigger Interval
                            </p>
                        }
                        name="triggerInterval"
                        rules={[
                            {
                                required: true,
                                message: "Please select interval!",
                            },
                        ]}
                    >
                        <Select
                            dropdownStyle={{ backgroundColor: "#2D2E2E" }}
                            onChange={(value) => setSelectedTrigger(value)}
                            options={[
                                {
                                    value: "Seconds",
                                    label: "Seconds",
                                },
                                {
                                    value: "Minutes",
                                    label: "Minutes",
                                },
                                {
                                    value: "Hours",
                                    label: "Hours",
                                },
                                {
                                    value: "Days",
                                    label: "Days",
                                },
                                {
                                    value: "Weeks",
                                    label: "Weeks",
                                },
                                {
                                    value: "Months",
                                    label: "Months",
                                },
                                {
                                    value: "Custom (Corn)",
                                    label: "Custom (Cron)",
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
                    {selectedTrigger && formRender[selectedTrigger]}
                </Form>
            </div>
        </div>
    );
};

export default ScheduleTriggerForm;

const ForSeconds = () => {
    return (
        <Form.Item
            label={
                <p className="text-sm text-gray-200">
                    Seconds Between Triggers
                </p>
            }
            name="SecondsBetweenTriggers"
            rules={[
                {
                    required: true,
                    message: "Please input seconds!",
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
                placeholder="Enter seconds"
            />
        </Form.Item>
    );
};

const ForMinutes = () => {
    return (
        <Form.Item
            label={
                <p className="text-sm text-gray-200">
                    Minutes Between Triggers
                </p>
            }
            name="minutesBetweenTriggers"
            rules={[
                {
                    required: true,
                    message: "Please input minutes!",
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
                placeholder="Enter minutes"
            />
        </Form.Item>
    );
};

const ForHours = () => {
    return (
        <>
            <Form.Item
                label={
                    <p className="text-sm text-gray-200">
                        Hours Between Triggers
                    </p>
                }
                name="hoursBetweenTriggers"
                rules={[
                    {
                        required: true,
                        message: "Please input hours!",
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
                    placeholder="Enter hours"
                />
            </Form.Item>
            <Form.Item
                label={
                    <p className="text-sm text-gray-200">Trigger at Minute</p>
                }
                name="triggerAtMinute"
                rules={[
                    {
                        required: true,
                        message: "Please input minute!",
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
                    placeholder="Enter minute"
                />
            </Form.Item>
        </>
    );
};

const ForDays = () => {
    return (
        <>
            <Form.Item
                label={
                    <p className="text-sm text-gray-200">
                        Days Between Triggers
                    </p>
                }
                name="daysBetweenTriggers"
                rules={[
                    {
                        required: true,
                        message: "Please input days!",
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
                    placeholder="Enter days"
                />
            </Form.Item>
            <Form.Item
                label={<p className="text-sm text-gray-200">Trigger at Hour</p>}
                name="triggerAtHour"
                rules={[
                    {
                        required: true,
                        message: "Please input hour!",
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
                    placeholder="Enter hour"
                />
            </Form.Item>
            <Form.Item
                label={
                    <p className="text-sm text-gray-200">Trigger at Minute</p>
                }
                name="triggerAtMinute"
                rules={[
                    {
                        required: true,
                        message: "Please input minute!",
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
                    placeholder="Enter minute"
                />
            </Form.Item>
        </>
    );
};

const ForWeeks = () => {
    return (
        <>
            <Form.Item
                label={
                    <p className="text-sm text-gray-200">
                        Weeks Between Triggers
                    </p>
                }
                name="weeksBetweenTriggers"
                rules={[
                    {
                        required: true,
                        message: "Please input Weeks!",
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
                    placeholder="Enter Weeks"
                />
            </Form.Item>
            <Form.Item
                label={
                    <p className="text-sm text-gray-200">Trigger on Weekdays</p>
                }
                name="triggerOnWeekdays"
                rules={[
                    {
                        required: true,
                        message: "Please select Weekdays!",
                    },
                ]}
            >
                <Select
                    dropdownStyle={{ backgroundColor: "#2D2E2E" }}
                    mode="multiple"
                    options={[
                        {
                            value: "Monday",
                            label: "Monday",
                        },
                        {
                            value: "Tuesday",
                            label: "Tuesday",
                        },
                        {
                            value: "Wednesday",
                            label: "Wednesday",
                        },
                        {
                            value: "Thursday",
                            label: "Thursday",
                        },
                        {
                            value: "Friday",
                            label: "Friday",
                        },
                        {
                            value: "Saturday",
                            label: "Saturday",
                        },
                        {
                            value: "Sunday",
                            label: "Sunday",
                        },
                    ]}
                    style={{
                        background: "#2D2E2E",
                        border: "1px solid #5b5c5c",
                        color: "#f4f4f4",
                    }}
                    placeholder="Select Weekdays"
                />
            </Form.Item>
            <Form.Item
                label={<p className="text-sm text-gray-200">Trigger at Hour</p>}
                name="triggerAtHour"
                rules={[
                    {
                        required: true,
                        message: "Please input hour!",
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
                    placeholder="Enter hour"
                />
            </Form.Item>
            <Form.Item
                label={
                    <p className="text-sm text-gray-200">Trigger at Minute</p>
                }
                name="triggerAtMinute"
                rules={[
                    {
                        required: true,
                        message: "Please input minute!",
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
                    placeholder="Enter minute"
                />
            </Form.Item>
        </>
    );
};

const ForMonths = () => {
    return (
        <>
            <Form.Item
                label={
                    <p className="text-sm text-gray-200">
                        Months Between Triggers
                    </p>
                }
                name="monthsBetweenTriggers"
                rules={[
                    {
                        required: true,
                        message: "Please input months!",
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
                    placeholder="Enter Months"
                />
            </Form.Item>
            <Form.Item
                label={
                    <p className="text-sm text-gray-200">
                        Trigger at Day of Month
                    </p>
                }
                name="triggerDayOfMonth"
                rules={[
                    {
                        required: true,
                        message: "Please input months!",
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
                    placeholder="Enter Months"
                />
            </Form.Item>
            <Form.Item
                label={<p className="text-sm text-gray-200">Trigger at Hour</p>}
                name="triggerAtHour"
                rules={[
                    {
                        required: true,
                        message: "Please select hour!",
                    },
                ]}
            >
                <Select
                    dropdownStyle={{ backgroundColor: "#2D2E2E" }}
                    mode="multiple"
                    options={[
                        {
                            value: "Midnight",
                            label: "Midnight",
                        },
                        {
                            value: "1am",
                            label: "1am",
                        },
                        {
                            value: "2am",
                            label: "2am",
                        },
                        {
                            value: "3am",
                            label: "3am",
                        },
                        {
                            value: "4am",
                            label: "4am",
                        },
                        {
                            value: "5am",
                            label: "5am",
                        },
                        {
                            value: "6am",
                            label: "6am",
                        },
                        {
                            value: "7am",
                            label: "7am",
                        },
                        {
                            value: "8am",
                            label: "8am",
                        },
                        {
                            value: "9am",
                            label: "9am",
                        },
                        {
                            value: "10am",
                            label: "10am",
                        },
                        {
                            value: "11am",
                            label: "11am",
                        },
                        {
                            value: "Noon",
                            label: "Noon",
                        },
                        {
                            value: "1pm",
                            label: "1pm",
                        },
                        {
                            value: "2pm",
                            label: "2pm",
                        },
                        {
                            value: "3pm",
                            label: "3pm",
                        },
                        {
                            value: "4pm",
                            label: "4pm",
                        },
                        {
                            value: "5pm",
                            label: "5pm",
                        },
                        {
                            value: "6pm",
                            label: "6pm",
                        },
                        {
                            value: "7pm",
                            label: "7pm",
                        },
                        {
                            value: "8pm",
                            label: "8pm",
                        },
                        {
                            value: "9pm",
                            label: "9pm",
                        },
                        {
                            value: "10pm",
                            label: "10pm",
                        },
                        {
                            value: "11pm",
                            label: "11pm",
                        },
                    ]}
                    style={{
                        background: "#2D2E2E",
                        border: "1px solid #5b5c5c",
                        color: "#f4f4f4",
                    }}
                    placeholder="Select Hour"
                />
            </Form.Item>
            <Form.Item
                label={
                    <p className="text-sm text-gray-200">Trigger at Minute</p>
                }
                name="triggerAtMinute"
                rules={[
                    {
                        required: true,
                        message: "Please input minute!",
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
                    placeholder="Enter minute"
                />
            </Form.Item>
        </>
    );
};

const ForCustom = () => {
    return (
        <Form.Item
            label={<p className="text-sm text-gray-200">Expression</p>}
            name="expression"
            rules={[
                {
                    required: true,
                    message: "Please input expression!",
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
                placeholder="Enter expression"
            />
        </Form.Item>
    );
};
