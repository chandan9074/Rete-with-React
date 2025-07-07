import React from "react";
// import { $socketsize } from "./vars";

export function CustomSocket({ data }) {
    const size = 16;

    return (
        <div
            title={data.name}
            className="
        inline-block
        cursor-pointer
        border
        border-gray-400
        align-middle
        bg-white
        box-border
        z-10
        hover:bg-gray-200
      "
            style={{ width: size, height: size * 2 }}
        />
    );
}
