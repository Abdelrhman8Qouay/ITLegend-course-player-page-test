export function initializeCollapsible() {
    const collapsibleHeaders = document.querySelectorAll(".collapsible__header");

    collapsibleHeaders.forEach((header) => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling as HTMLElement;
            const icon = header.querySelector(".collapsible__icon") as HTMLElement;

            if (content.style.maxHeight) {
                content.style.maxHeight = "";
                icon.textContent = "+";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.textContent = "-";
            }
        });
    });
}