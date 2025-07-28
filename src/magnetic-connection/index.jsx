import { NodeEditor } from "rete";
import { AreaPlugin } from "rete-area-plugin";
import { createPseudoconnection } from "rete-connection-plugin";
import { getElementCenter } from "rete-render-utils";
import { findNearestPoint, isInsideRect } from "./math";
import { getNodeRect } from "./utils";

export { MagneticConnection } from "./MagneticConnection";

export function useMagneticConnection(connection, props) {
    const area = connection.parentScope(AreaPlugin);
    const editor = area.parentScope(NodeEditor);
    const sockets = new Map();
    const magneticConnection = createPseudoconnection({
        isMagnetic: true,
    });
    const margin = typeof props.margin !== "undefined" ? props.margin : 50;
    const distance =
        typeof props.distance !== "undefined" ? props.distance : 50;

    let picked = null;
    let nearestSocket = null;

    connection.addPipe(async (context) => {
        // console.log("Magnetic connection context", context);
        if (!context || typeof context !== "object" || !("type" in context))
            return context;

        if (context.type === "connectionpick") {
            picked = context.data.socket;
        } else if (context.type === "connectiondrop") {
            if (nearestSocket && !context.data.created) {
                await props.createConnection(
                    context.data.initial,
                    nearestSocket
                );
            }

            picked = null;
            magneticConnection.unmount(area);
        } else if (context.type === "pointermove") {
            if (!picked) return context;
            const point = context.data.position;
            const nodes = Array.from(area.nodeViews.entries());
            const socketsList = Array.from(sockets.values());

            const rects = nodes.map(([id, view]) => ({
                id,
                ...getNodeRect(editor.getNode(id), view),
            }));
            const nearestRects = rects.filter((rect) =>
                isInsideRect(rect, point, margin)
            );
            const nearestNodes = nearestRects.map(({ id }) => id);
            const nearestSockets = socketsList.filter((item) =>
                nearestNodes.includes(item.nodeId)
            );
            const socketsPositions = await Promise.all(
                nearestSockets.map(async (socket) => {
                    const nodeView = area.nodeViews.get(socket.nodeId);

                    if (!nodeView) throw new Error("node view");

                    const { x, y } = await getElementCenter(
                        socket.element,
                        nodeView.element
                    );

                    return {
                        ...socket,
                        x: x + nodeView.position.x,
                        y: y + nodeView.position.y,
                    };
                })
            );
            nearestSocket =
                findNearestPoint(socketsPositions, point, distance) || null;

            if (nearestSocket && props.display(picked, nearestSocket)) {
                if (!magneticConnection.isMounted())
                    magneticConnection.mount(area);
                const { x, y } = nearestSocket;

                magneticConnection.render(
                    area,
                    props.offset(nearestSocket, { x, y }),
                    picked
                );
            } else if (magneticConnection.isMounted()) {
                magneticConnection.unmount(area);
            }
        } else if (
            context.type === "render" &&
            context.data.type === "socket"
        ) {
            const { element } = context.data;

            sockets.set(element, context.data);
        } else if (context.type === "unmount") {
            sockets.delete(context.data.element);
        }
        return context;
    });
}
