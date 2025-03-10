export function initializeCourseMaterials() {
    const materials = [
        { icon: "duration.png", title: "Duration", value: "3 Weeks" },
        { icon: "lessons.png", title: "Lessons", value: "12" },
        { icon: "quizzes.png", title: "Quizzes", value: "5" },
    ];

    const materialsContainer = document.querySelector(".materials .details");

    if (materialsContainer) {
        materials.forEach((material) => {
            const materialItem = document.createElement("div");
            materialItem.className = "info";

            materialItem.innerHTML = `
                <div class="ico">
                    <img src="./assets/icons/${material.icon}">
                </div>
                <div class="title">${material.title}:</div>
                <div class="val">${material.value}</div>
            `;

            materialsContainer.appendChild(materialItem);
        });
    }
}
