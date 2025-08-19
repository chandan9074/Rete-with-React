import { useEffect, useRef, useCallback, useState } from "react";
import { createEditor } from "../workflow/editor";

export const useEditor = (
    nodeList,
    setNodeList,
    openFormDrawer,
    setOpenFormDrawer,
    selectedNode,
    setSelectedNode,
    handleExecute,
    updateAsJson,
    setUpdateAdJson,
    openRenameModal,
    setOpenRenameModal,
    handleDuplicateNodeUpdate
) => {
    const editorContainerRef = useRef(null);
    const editorInitialized = useRef(false);
    const editorInstance = useRef(null);
    const [editorReady, setEditorReady] = useState(false);

    const initializeEditor = useCallback(async () => {
        if (editorInitialized.current || !editorContainerRef.current) {
            return;
        }

        console.log(
            "Initializing editor with container:",
            editorContainerRef.current
        );
        editorInitialized.current = true;

        try {
            const editor = await createEditor(editorContainerRef.current, {
                openFormDrawer,
                setOpenFormDrawer,
                selectedNode,
                setSelectedNode,
                setNodeList,
                nodeList,
                handleExecution: handleExecute,
                setUpdateAdJson,
                updateAsJson,
                setOpenRenameModal,
                openRenameModal,
                handleDuplicateNodeUpdate,
            });

            editorInstance.current = editor;
            editorContainerRef.current.editor = editor;
            setEditorReady(true);
            console.log("Editor initialized successfully");
        } catch (error) {
            console.error("Error initializing editor:", error);
            editorInitialized.current = false; // Reset on error
            setEditorReady(false);
        }
    }, [
        openFormDrawer,
        setOpenFormDrawer,
        selectedNode,
        setSelectedNode,
        setNodeList,
        nodeList,
        handleExecute,
        setUpdateAdJson,
        updateAsJson,
        setOpenRenameModal,
        openRenameModal,
        handleDuplicateNodeUpdate,
    ]);

    // Use a ref callback to initialize the editor when the DOM element is ready
    const setEditorContainer = useCallback(
        (element) => {
            editorContainerRef.current = element;
            if (element && !editorInitialized.current) {
                // Use setTimeout to ensure the element is fully mounted
                setTimeout(() => {
                    initializeEditor();
                }, 0);
            }
        },
        [initializeEditor]
    );

    // Cleanup effect
    useEffect(() => {
        return () => {
            if (editorInstance.current?.destroy) {
                editorInstance.current.destroy();
            }
        };
    }, []);

    return {
        editorContainerRef: setEditorContainer,
        editor: editorInstance.current,
        editorReady,
    };
};
