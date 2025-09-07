document.addEventListener("DOMContentLoaded", () => {
  // ----- Simple auto slider -----
  const track = document.getElementById("slides");
  if (track) {
    const slides = Array.from(track.children);
    let index = 0;

    // dots
    const dotsEl = document.getElementById("dots");
    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      if (i === 0) b.classList.add("active");
      b.addEventListener("click", () => goTo(i, true));
      dotsEl.appendChild(b);
      return b;
    });

    const set = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle("active", i === index));
    };

    const goTo = (i, user = false) => {
      index = (i + slides.length) % slides.length;
      set();
      if (user) restart(); // reset timer if user clicks a dot
    };

    let timer = null;
    const start = () => (timer = setInterval(() => goTo(index + 1), 4500));
    const stop = () => timer && clearInterval(timer);
    const restart = () => { stop(); start(); };

    // pause on hover/focus for accessibility
    track.addEventListener("mouseenter", stop);
    track.addEventListener("mouseleave", start);
    track.addEventListener("focusin", stop);
    track.addEventListener("focusout", start);

    start();
  }
});


