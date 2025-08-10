// addCustomBackground.js
export function addCustomBackground(area) {
    const background = document.createElement("div");
    background.classList.add("background", "fill-area");
    area.area.content.add(background);
}
