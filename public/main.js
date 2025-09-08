// public/js/main.js

// Smooth scrolling for in-page nav links
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.primary-actions a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});


