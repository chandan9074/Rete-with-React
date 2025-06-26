import React from "react";

export const CustomSocket = ({ socket }) => {
    return (
        <div
            className="custom-socket"
            style={{
                width: "10px",
                height: "10px",
                backgroundColor: "blue",
                borderRadius: "50%",
            }}
        >
            {socket?.name || "Socket"}
        </div>
    );
};
