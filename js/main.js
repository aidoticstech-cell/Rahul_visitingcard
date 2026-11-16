(() => {
  const card = document.getElementById("card");
  const contacts = Array.from(document.querySelectorAll("[data-expand]"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Soft pointer glow + tilt on desktop */
  if (card && canHover && !reduceMotion) {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const tiltX = (0.5 - y) * 6;
      const tiltY = (x - 0.5) * 8;

      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  }

  /* Contact expand: hover desktop, tap mobile */
  const closeAllContacts = (except) => {
    contacts.forEach((item) => {
      if (item !== except) item.classList.remove("is-open");
    });
  };

  contacts.forEach((item) => {
    const link = item.querySelector(".contact__hit");

    if (canHover) {
      item.addEventListener("mouseenter", () => {
        closeAllContacts(item);
        item.classList.add("is-open");
      });
      item.addEventListener("mouseleave", () => {
        item.classList.remove("is-open");
      });
      return;
    }

    /* Touch / coarse pointer: first tap expands, second tap follows link */
    link.addEventListener("click", (event) => {
      if (!item.classList.contains("is-open")) {
        event.preventDefault();
        closeAllContacts(item);
        item.classList.add("is-open");
      }
    });
  });

  document.addEventListener("pointerdown", (event) => {
    if (!event.target.closest("[data-expand]")) {
      closeAllContacts();
    }
  });
})();

