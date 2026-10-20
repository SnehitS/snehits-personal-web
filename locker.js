(() => {
    const triggers = [...document.querySelectorAll("[data-opens]")];
    if (!triggers.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function closeAll() {
        triggers.forEach((trigger) => {
            trigger.setAttribute("aria-expanded", "false");
            const report = document.getElementById(trigger.getAttribute("data-opens"));
            if (report) report.hidden = true;
        });
    }

    function open(trigger) {
        const id = trigger.getAttribute("data-opens");
        const report = document.getElementById(id);
        if (!report) return;
        trigger.setAttribute("aria-expanded", "true");
        report.hidden = false;
        if (!reduced) {
            report.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    }

    triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const expanded = trigger.getAttribute("aria-expanded") === "true";
            closeAll();
            if (!expanded) open(trigger);
        });
    });

    if (reduced) return;

    document.querySelectorAll(".kit").forEach((kit) => {
        const swayEl = kit.querySelector(".kit-sway");
        if (!swayEl) return;

        kit.addEventListener("pointerenter", () => kit.classList.add("is-held"));
        kit.addEventListener("pointerleave", () => {
            kit.classList.remove("is-held");
            kit.style.setProperty("--sway", "0deg");
        });
        kit.addEventListener("pointermove", (event) => {
            const box = kit.getBoundingClientRect();
            const x = (event.clientX - box.left) / box.width - 0.5;
            kit.style.setProperty("--sway", `${(x * 9).toFixed(2)}deg`);
        });
    });
})();
