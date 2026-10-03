/* ── Therapy Drop Stage: pause off-screen for smoothness/perf ── */
function initTherapyStage() {
    const stage = document.getElementById("therapyStage");
    if (!stage) return;
    if (prefersReducedMotion) return; // CSS already freezes drops
    const animated = stage.querySelectorAll(
        ".therapy-drop, .therapy-ripple"
    );
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const state = entry.isIntersecting ? "running" : "paused";
                animated.forEach((el) => {
                    el.style.animationPlayState = state;
                });
            });
        }, { threshold: 0.05 }
    );
    io.observe(stage);
    /* Tab hidden ho to bhi pause — jank-free resume */
    document.addEventListener("visibilitychange", () => {
        const state = document.hidden ? "paused" : "running";
        animated.forEach((el) => {
            el.style.animationPlayState = state;
        });
    });
}