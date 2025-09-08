// public/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  // Update © year in the footer (only if that element exists)
  const el = document.getElementById("year");
  if (el) el.textContent = String(new Date().getFullYear());

  // Smooth-scroll for any #anchor links inside the header nav
  document
    .querySelectorAll('.primary-actions a[href^="#"]')
    .forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        const section = id ? document.querySelector(id) : null;
        if (section) {
          e.preventDefault();
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
});

