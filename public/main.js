document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();

  // Smooth scroll for anchor links
  document.querySelectorAll('.primary-actions a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const section = document.querySelector(id);
      if (section) {
        e.preventDefault();
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
});


