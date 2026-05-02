(function () {
  const root = document.documentElement;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  let theme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  root.setAttribute("data-theme", theme);

  function paintThemeButton() {
    if (!themeToggle) return;
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    themeToggle.textContent = theme === "dark" ? "☀" : "●";
  }

  paintThemeButton();
  themeToggle?.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", theme);
    paintThemeButton();
  });

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  menuToggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.querySelectorAll('a[href^="#"]').forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      const target = document.querySelector(trigger.getAttribute("href"));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        nav?.classList.remove("is-open");
        menuToggle?.setAttribute("aria-expanded", "false");
      }
    });
  });

  const quoteForm = document.querySelector("[data-quote-form]");
  const success = document.querySelector("[data-form-success]");
  quoteForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }

    const data = new FormData(quoteForm);
    const recipient = quoteForm.dataset.recipient || "";
    const subject = `Price My Cut request - ${data.get("address") || "new yard"}`;
    const body = [
      "Steel Harbor Yardworks quote request",
      "",
      `Name: ${data.get("name") || ""}`,
      `Address: ${data.get("address") || ""}`,
      `Phone: ${data.get("phone") || ""}`,
      `Email: ${data.get("email") || ""}`,
      `Service needed: ${data.get("service") || ""}`,
      `Weekly or one-time: ${data.get("frequency") || ""}`,
      `Preferred contact: ${data.get("contact") || ""}`,
      "",
      "Notes:",
      data.get("notes") || "None provided"
    ].join("\n");

    window.location.href = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    success?.classList.add("is-visible");
    success?.scrollIntoView({ behavior: "smooth", block: "center" });
  });
})();
