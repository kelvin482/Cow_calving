(() => {
  const intervals = [];

  const toast = (message) => {
    let host = document.querySelector(".ccp-toast-host");
    if (!host) {
      host = document.createElement("div");
      host.className = "ccp-toast-host";
      host.setAttribute("aria-live", "polite");
      host.setAttribute("aria-atomic", "true");
      document.body.appendChild(host);
    }

    const note = document.createElement("div");
    note.className = "ccp-toast";
    note.textContent = message;
    host.appendChild(note);

    requestAnimationFrame(() => note.classList.add("ccp-toast-show"));
    setTimeout(() => {
      note.classList.remove("ccp-toast-show");
      setTimeout(() => note.remove(), 220);
    }, 2200);
  };

  const setupReveal = () => {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((el) => observer.observe(el));
  };

  const setupFilters = () => {
    const filters = document.querySelectorAll(".ccp-filter-btn");
    const cards = document.querySelectorAll(".ccp-cow-card");
    if (!filters.length || !cards.length) return;

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter || "all";
        filters.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        cards.forEach((card) => {
          const state = card.dataset.state || "";
          const show = filter === "all" || state.includes(filter);
          card.classList.toggle("ccp-hidden", !show);
        });
      });
    });
  };

  const setupTimestamps = () => {
    const stamps = document.querySelectorAll(".ccp-updated[data-minutes]");
    if (!stamps.length) return;

    intervals.push(
      setInterval(() => {
        stamps.forEach((stamp) => {
          const raw = Number(stamp.dataset.minutes || "0");
          const next = raw + 1;
          stamp.dataset.minutes = String(next);
          stamp.textContent = `Updated ${next} minutes ago`;
        });
      }, 60000)
    );
  };

  const setupActionCards = () => {
    const cards = document.querySelectorAll(".ccp-action-card[data-action]");
    cards.forEach((card) => {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");

      const run = () => toast(`${card.dataset.action} opened`);
      card.addEventListener("click", run);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          run();
        }
      });
    });
  };

  const setupButtons = () => {
    document.querySelectorAll(".ccp-menu-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toast("Menu options coming soon");
      });
    });

    document.querySelectorAll(".ccp-card-actions .btn-primary").forEach((btn) => {
      btn.addEventListener("click", () => toast("Live monitoring launched"));
    });

    document.querySelectorAll(".ccp-card-actions .btn-secondary").forEach((btn) => {
      btn.addEventListener("click", () => toast("Protocol view opened"));
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    setupReveal();
    setupFilters();
    setupTimestamps();
    setupActionCards();
    setupButtons();
  });

  window.addEventListener("beforeunload", () => {
    intervals.forEach((id) => clearInterval(id));
  });
})();
