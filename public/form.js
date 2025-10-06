// public/form.js
(function () {
  // Attach simple HTML5 validation to a form (by id)
  function wireForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    // Clear aria-invalid on input
    form.addEventListener("input", (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.target.checkValidity()) {
          e.target.removeAttribute("aria-invalid");
        }
      }
    });

    form.addEventListener("submit", (e) => {
      // Let the browser validate first
      if (!form.checkValidity()) {
        e.preventDefault();

        // Mark invalid fields accessibly
        const invalid = form.querySelectorAll(":invalid");
        invalid.forEach((el) => el.setAttribute("aria-invalid", "true"));

        // Optional: move focus to the first invalid field
        if (invalid.length) invalid[0].focus();

        // Minimal user feedback (no styling assumptions)
        alert("Please fix the highlighted fields.");
      }
    });
  }

  // Forms used by the account pages
  wireForm("account-form");  // name/email form in update.ejs
  wireForm("password-form"); // password form in update.ejs
  wireForm("login-form");    // login form in manage.ejs (if you add id="login-form")
})();
