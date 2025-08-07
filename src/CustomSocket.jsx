import React from "react";
import { MdDelete } from "react-icons/md";
// import { $socketsize } from "./vars";

export function CustomSocket({ data }) {
    const size = 16;

    return (
        <div className="relative">
            <div
                title={data.name}
                className="
        inline-block
        cursor-pointer
        align-middle
        bg-gray-200
        box-border
        z-10
        hover:bg-gray-200
        w-4 h-4 rounded-full
      "
            />
        </div>
    );
}
