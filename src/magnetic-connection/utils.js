export function getNodeRect(node, view) {
    const {
        position: { x, y },
    } = view;

    // Provide default values for width and height if they are missing
    const width =
        typeof node.width === "number"
            ? node.width
            : view.element.offsetWidth || 0;
    const height =
        typeof node.height === "number"
            ? node.height
            : view.element.offsetHeight || 0;

    console.log(node, "getNodeRect node");
    console.log({ width, height }, "Calculated width and height");

    return {
        left: x,
        top: y,
        right: x + width,
        bottom: y + height,
    };
}
