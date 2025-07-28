export function getNodeRect(node, view) {
    const {
        position: { x, y },
    } = view;

    return {
        left: x,
        top: y,
        right: x + node.width,
        bottom: y + node.height,
    };
}
