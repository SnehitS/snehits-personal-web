(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const triggers = [...document.querySelectorAll("[data-opens]")];
    const aisle = document.querySelector(".aisle");

    function closeAll() {
        triggers.forEach((trigger) => {
            trigger.setAttribute("aria-expanded", "false");
            const report = document.getElementById(trigger.getAttribute("data-opens"));
            if (report) report.hidden = true;
        });
    }

    function open(trigger) {
        const report = document.getElementById(trigger.getAttribute("data-opens"));
        if (!report) return;
        trigger.setAttribute("aria-expanded", "true");
        report.hidden = false;
        if (!reduced) {
            report.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
    }

    triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
            if (aisle?.classList.contains("did-drag")) return;
            const expanded = trigger.getAttribute("aria-expanded") === "true";
            closeAll();
            if (!expanded) open(trigger);
        });
    });

    if (aisle) {
        let down = false;
        let startX = 0;
        let startScroll = 0;

        aisle.addEventListener("pointerdown", (event) => {
            if (event.pointerType === "mouse" && event.button !== 0) return;
            if (event.target.closest("a")) return;
            down = true;
            startX = event.clientX;
            startScroll = aisle.scrollLeft;
            aisle.classList.add("is-dragging");
            aisle.classList.remove("did-drag");
        });

        window.addEventListener("pointermove", (event) => {
            if (!down) return;
            const dx = event.clientX - startX;
            aisle.scrollLeft = startScroll - dx;
            if (Math.abs(dx) > 6) aisle.classList.add("did-drag");
        });

        window.addEventListener("pointerup", () => {
            down = false;
            aisle.classList.remove("is-dragging");
        });

        aisle.addEventListener("keydown", (event) => {
            const step = 200;
            if (event.key === "ArrowRight") {
                aisle.scrollBy({ left: step, behavior: reduced ? "auto" : "smooth" });
            }
            if (event.key === "ArrowLeft") {
                aisle.scrollBy({ left: -step, behavior: reduced ? "auto" : "smooth" });
            }
        });
    }

    document.querySelectorAll("[data-scroll-aisle]").forEach((link) => {
        link.addEventListener("click", (event) => {
            const id = link.getAttribute("href")?.slice(1);
            const target = id ? document.getElementById(id) : null;
            if (!aisle || !target) return;
            event.preventDefault();
            const left = target.getBoundingClientRect().left - aisle.getBoundingClientRect().left + aisle.scrollLeft - 8;
            aisle.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
        });
    });

    if (reduced) return;

    document.querySelectorAll(".stall-hit").forEach((hit) => {
        const kit = hit.querySelector(".kit");
        if (!kit) return;
        hit.addEventListener("pointerenter", () => hit.classList.add("is-held"));
        hit.addEventListener("pointerleave", () => {
            hit.classList.remove("is-held");
            kit.style.setProperty("--sway", "0deg");
        });
        hit.addEventListener("pointermove", (event) => {
            const box = kit.getBoundingClientRect();
            const x = (event.clientX - box.left) / Math.max(box.width, 1) - 0.5;
            kit.style.setProperty("--sway", `${(x * 8).toFixed(2)}deg`);
        });
    });
})();
