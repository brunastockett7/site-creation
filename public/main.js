document.addEventListener("DOMContentLoaded", () => {
  // Mobile nav toggle (class-based so CSS controls layout)
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      // Toggle class on the parent nav container:
      // parentElement is <nav class="site-nav"> that wraps the <ul>
      const navContainer = nav.closest(".site-nav");
      if (navContainer) {
        navContainer.classList.toggle("open", open);
      }
    };

    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      setOpen(!open);
    });

    // Initialize closed on mobile, open on desktop
    const init = () => setOpen(window.innerWidth >= 768);
    init();
    window.addEventListener("resize", init);
  }

  // Footer year
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});

