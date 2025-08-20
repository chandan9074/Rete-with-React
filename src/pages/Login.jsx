import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useLogin } from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTE_SLUGS, DEFAULT_ROUTES } from "../helpers/routeSlugs";
import autoFullLogo from "../assets/auto_full_logo.svg";

const Login = () => {
    const { setUserData } = useAuth();
    const loginMutation = useLogin();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || DEFAULT_ROUTES.AUTHENTICATED;

    const onFinish = async (values) => {
        try {
            const data = await loginMutation.mutateAsync(values);

            // Update user data in context
            setUserData(data.user);

            message.success("Login successful!");
            navigate(from, { replace: true });
        } catch (error) {
            message.error(error.message || "Login failed. Please try again.");
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
        message.error("Please fill in all required fields.");
    };

    return (
        <div className="min-h-screen bg-[#232323] flex items-center justify-center p-4">
            <Card
                className="w-full max-w-md shadow-2xl border-none rounded-2xl animate-fade-in"
                style={{
                    background:
                        "linear-gradient(135deg, #2D2E2E 60%, #EF4E39 100%)",
                    border: "none",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    padding: 0,
                }}
                bodyStyle={{ padding: "2.5rem 2rem 2rem 2rem" }}
            >
                <div className="flex flex-col items-center mb-8">
                    <img
                        src={autoFullLogo}
                        alt="Project Logo"
                        className="h-14 mb-4 drop-shadow-lg animate-fade-in"
                        style={{ filter: "drop-shadow(0 2px 8px #EF4E39)" }}
                    />
                    <h1
                        className="text-3xl font-extrabold text-gray-100 mb-1 tracking-tight"
                        style={{ letterSpacing: "-1px" }}
                    >
                        Welcome Back
                    </h1>
                    <p className="text-gray-300 text-base font-medium">
                        Sign in to your account
                    </p>
                </div>

                <Form
                    name="login"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        label={
                            <span className="text-gray-200 font-semibold">
                                Username
                            </span>
                        }
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please input your username!",
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-[#EF4E39]" />}
                            placeholder="Enter your username"
                            size="large"
                            style={{
                                backgroundColor: "#232323",
                                borderColor: "#EF4E39",
                                color: "#f4f4f4",
                                fontWeight: 500,
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        label={
                            <span className="text-gray-200 font-semibold">
                                Password
                            </span>
                        }
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="text-[#EF4E39]" />}
                            placeholder="Enter your password"
                            size="large"
                            style={{
                                backgroundColor: "#232323",
                                borderColor: "#EF4E39",
                                color: "#f4f4f4",
                                fontWeight: 500,
                            }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loginMutation.isPending}
                            size="large"
                            className="w-full font-bold tracking-wide shadow-md"
                            style={{
                                background:
                                    "linear-gradient(90deg, #EF4E39 60%, #FF6F5C 100%)",
                                border: "none",
                                height: "48px",
                                fontSize: "17px",
                                letterSpacing: "0.5px",
                                boxShadow: "0 2px 8px 0 #EF4E3933",
                            }}
                        >
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>

                {/* <div className="text-center mt-4">
                    <span className="text-gray-400">
                        Don't have an account?{" "}
                        <a
                            href="#"
                            className="text-[#EF4E39] hover:text-[#FF6F5C] font-semibold transition-colors duration-200"
                            onClick={(e) => {
                                e.preventDefault();
                                message.info(
                                    "Registration is currently not available."
                                );
                            }}
                        >
                            Sign up
                        </a>
                    </span>
                </div> */}
            </Card>
        </div>
    );
};

export default Login;
