import React, { createContext, useContext, useState } from "react";

const CommonContext = createContext("CommonContext");

const CommonContextProvider = ({ children }) => {
    const [openFormDrawer, setOpenFormDrawer] = useState(false);
    const [selectedNode, setSelectedNode] = useState(null);

    return (
        <CommonContext.Provider
            value={{
                openFormDrawer,
                setOpenFormDrawer,
                selectedNode,
                setSelectedNode,
            }}
        >
            {children}
        </CommonContext.Provider>
    );
};

export default CommonContextProvider;

export const useCommon = () => {
    const context = useContext(CommonContext);
    if (!context) {
        throw new Error(
            "useCommon must be used within an CommonContextProvider"
        );
    }
    return context;
};
