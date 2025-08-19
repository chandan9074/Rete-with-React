import React from "react";
import { message } from "antd";
import { MdLogout, MdAccountCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTE_SLUGS } from "../helpers/routeSlugs";
import autoFullLogo from "../assets/auto_full_logo.svg";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, clearUserData } = useAuth();

    const handleLogout = () => {
        // Clear authentication data from localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");

        // Clear user data from context
        clearUserData();

        // Show success message
        message.success("Logged out successfully");

        // Navigate to login page
        navigate(ROUTE_SLUGS.LOGIN, { replace: true });
    };

    return (
        <nav className="bg-[#3c3c3c] border-b border-[#2b2a25] shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - Logo/Brand */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <img
                                src={autoFullLogo}
                                alt="Auto Logo"
                                className="h-14 w-auto"
                            />
                        </div>
                    </div>

                    {/* Right side - User info and logout */}
                    <div className="flex items-center space-x-4">
                        {/* User info */}
                        {user && (
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                    <MdAccountCircle className="text-gray-300 text-2xl" />
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-medium text-gray-200">
                                            {user.username || "User"}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {user.email || "user@example.com"}
                                        </p>
                                    </div>
                                </div>

                                {/* Separator */}
                                <div className="h-6 w-px bg-gray-600"></div>

                                {/* Logout button */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors duration-200"
                                    title="Logout"
                                >
                                    <MdLogout className="text-lg" />
                                    <span className="hidden sm:inline">
                                        Logout
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
