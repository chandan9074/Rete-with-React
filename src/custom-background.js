export function addCustomBackground(area) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas dimensions
    canvas.width = 2000;
    canvas.height = 2000;

    // Draw a grid pattern on the canvas
    const gridSize = 20;
    context.fillStyle = "#f0f0f0"; // Background color
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = "#e0e0e0"; // Grid line color
    context.lineWidth = 0.5;

    for (let x = 0; x < canvas.width; x += gridSize) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }

    // Add the canvas as a background to the editor area
    area.container.style.backgroundImage = `url(${canvas.toDataURL()})`;
    area.container.style.backgroundSize = `${gridSize}px ${gridSize}px`;
}
