export function findNearestPoint(points, target, maxDistance) {
    return points.reduce((nearestPoint, point) => {
        const distance = Math.sqrt(
            (point.x - target.x) ** 2 + (point.y - target.y) ** 2
        );

        if (distance > maxDistance) return nearestPoint;
        if (nearestPoint === null || distance < nearestPoint.distance)
            return { point, distance };
        return nearestPoint;
    }, null)?.point;
}

export function isInsideRect(rect, point, margin) {
    const isInside =
        point.y > rect.top - margin &&
        point.x > rect.left - margin &&
        point.x < rect.right + margin &&
        point.y < rect.bottom + margin;

    return isInside;
}
