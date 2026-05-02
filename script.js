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
  const error = document.querySelector("[data-form-error]");
  const formTarget = document.querySelector('iframe[name="google-form-target"]');
  let formSubmitted = false;
  let formTimer = null;

  quoteForm?.addEventListener("submit", () => {
    if (!quoteForm.checkValidity()) {
      quoteForm.reportValidity();
      return;
    }

    const submitButton = quoteForm.querySelector('button[type="submit"]');
    quoteForm.dataset.buttonText = submitButton?.textContent || "Price My Cut";

    formSubmitted = true;
    success?.classList.remove("is-visible");
    error?.classList.remove("is-visible");
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    clearTimeout(formTimer);
    formTimer = setTimeout(() => {
      if (!formSubmitted) return;
      formSubmitted = false;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = quoteForm.dataset.buttonText || "Price My Cut";
      }
      error?.classList.add("is-visible");
      error?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 8000);
  });

  formTarget?.addEventListener("load", () => {
    if (!formSubmitted) return;
    formSubmitted = false;
    clearTimeout(formTimer);

    const submitButton = quoteForm?.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = quoteForm?.dataset.buttonText || "Price My Cut";
    }

    try {
      quoteForm.reset();
      success?.classList.add("is-visible");
      success?.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (submissionError) {
      error?.classList.add("is-visible");
      error?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
})();
