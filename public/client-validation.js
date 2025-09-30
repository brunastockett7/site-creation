// public/js/client-validation.js
document.addEventListener("DOMContentLoaded", () => {
  // helper: trim all text inputs + textareas in a form
  function trimTextFields(form) {
    form.querySelectorAll('input[type="text"], textarea')
      .forEach(el => el.value = el.value.trim());
  }

  /* ==========================
   * Add Classification Form
   * ========================== */
  const classForm = document.querySelector("#add-classification-form");
  if (classForm) {
    classForm.addEventListener("submit", (e) => {
      trimTextFields(classForm);

      const name = classForm.classification_name.value;
      if (name.length < 3 || name.length > 30) {
        e.preventDefault();
        alert("Classification name must be 3–30 characters.");
        classForm.classification_name.focus();
        return;
      }
      if (!/^[A-Za-z0-9]+$/.test(name)) {
        e.preventDefault();
        alert("Use letters/numbers only (no spaces or special characters).");
        classForm.classification_name.focus();
        return;
      }

      // as a safety net, let HTML5 show its messages if any remain
      if (!classForm.checkValidity()) {
        e.preventDefault();
        classForm.reportValidity();
      }
    });
  }

  /* ==========================
   * Add Vehicle Form
   * ========================== */
  const vehicleForm = document.querySelector("#add-vehicle-form");
  if (vehicleForm) {
    vehicleForm.addEventListener("submit", (e) => {
      trimTextFields(vehicleForm);

      const make  = vehicleForm.inv_make.value;
      const model = vehicleForm.inv_model.value;
      const year  = parseInt(vehicleForm.inv_year.value, 10);
      const price = parseFloat(vehicleForm.inv_price.value);
      const miles = parseInt(vehicleForm.inv_miles.value, 10);
      const color = vehicleForm.inv_color.value;
      const img   = vehicleForm.inv_image?.value || "";
      const thumb = vehicleForm.inv_thumbnail?.value || "";
      const classSel = vehicleForm.classification_id;

      if (make.length < 2) {
        e.preventDefault(); alert("Make must be at least 2 characters."); vehicleForm.inv_make.focus(); return;
      }
      if (model.length < 1) {
        e.preventDefault(); alert("Model is required."); vehicleForm.inv_model.focus(); return;
      }
      if (isNaN(year) || year < 1900 || year > 2100) {
        e.preventDefault(); alert("Year must be between 1900 and 2100."); vehicleForm.inv_year.focus(); return;
      }
      if (isNaN(price) || price < 0) {
        e.preventDefault(); alert("Price must be ≥ 0."); vehicleForm.inv_price.focus(); return;
      }
      if (isNaN(miles) || miles < 0) {
        e.preventDefault(); alert("Miles must be ≥ 0."); vehicleForm.inv_miles.focus(); return;
      }
      if (!/^[A-Za-z ]{3,30}$/.test(color)) {
        e.preventDefault(); alert("Color must be 3–30 letters/spaces."); vehicleForm.inv_color.focus(); return;
      }

      // image path validations to match server rules
      const imgRe = /^\/images\/[^ ]+\.(jpg|jpeg|png|webp)$/i;
      if (!imgRe.test(img)) {
        e.preventDefault(); alert("Image path must look like /images/file.webp (jpg|jpeg|png|webp)."); vehicleForm.inv_image.focus(); return;
      }
      if (!imgRe.test(thumb)) {
        e.preventDefault(); alert("Thumbnail path must look like /images/file.webp (jpg|jpeg|png|webp)."); vehicleForm.inv_thumbnail.focus(); return;
      }

      if (!classSel || !classSel.value || Number(classSel.value) < 1) {
        e.preventDefault(); alert("Please choose a classification."); (classSel || vehicleForm).focus(); return;
      }

      // safety net: use built-in messages if any attribute rules fail
      if (!vehicleForm.checkValidity()) {
        e.preventDefault();
        vehicleForm.reportValidity();
      }
    });
  }
});
