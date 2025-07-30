export const defaultJson = {
    base: "vs-dark",
    inherit: true,
    rules: [
        {
            token: "comment",
            foreground: "#888888",
            fontStyle: "italic",
        },
        {
            token: "keyword",
            foreground: "#FF0000",
        },
        {
            token: "string",
            foreground: "#00FF00",
        },
        {
            token: "variable",
            foreground: "#FFA500",
        },
        {
            token: "function",
            foreground: "#0000FF",
            fontStyle: "bold",
        },
    ],
    colors: {
        "editor.background": "#1E1E1E",
        "editor.foreground": "#D4D4D4",
        "editorCursor.foreground": "#00FF00",
        "editor.lineHighlightBackground": "#2A2A2A",
        "editor.selectionBackground": "#4D4D4D",
        "editor.selectionHighlightBackground": "#3C3C3C",
        "editor.findMatchBackground": "#FF00FF",
        "editor.findMatchHighlightBackground": "#FF00FF80",
        "editor.wordHighlightBackground": "#FF8000",
        "editor.wordHighlightStrongBackground": "#FF4000",
        "editor.hoverHighlightBackground": "#00FFFF",
    },
};

export const monacoTheme = {
    base: "vs",
    inherit: true,
    rules: [
        { token: "", foreground: "FFFFFF" }, // Default text color (white)
        {
            token: "string.key.json",
            foreground: "FFFFFF",
        }, // JSON key color (white)
        {
            token: "string.value.json",
            foreground: "FFFFFF",
        }, // JSON value color (white)
        {
            token: "delimiter.colon.json",
            foreground: "AAAAAA",
        }, // Colon color (light gray)
        {
            token: "delimiter.bracket",
            foreground: "87CEEB",
        }, // Curly braces color (light blue)
        {
            token: "delimiter.parenthesis",
            foreground: "87CEEB",
        }, // Parentheses color (light blue)
        {
            token: "delimiter.square",
            foreground: "AAAAAA",
        }, // Square brackets color (light gray)
    ],
    colors: {
        "editor.background": "#414244", // Background color
        "editor.foreground": "#FFFFFF", // Default foreground color
        "editorCursor.foreground": "#FFFFFF", // Cursor color
        "editor.selectionBackground": "#3A3B3C", // Selection background
        "editor.lineHighlightBackground": "#2D2E2E", // Line highlight background
    },
};
