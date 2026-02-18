(() => {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getControls = (form) =>
    Array.from(form.querySelectorAll("input, select, textarea")).filter((el) => {
      const type = (el.getAttribute("type") || "").toLowerCase();
      return !["hidden", "checkbox", "radio", "submit", "button"].includes(type);
    });

  const getInlineErrorNode = (fieldWrap) => {
    let node = fieldWrap.querySelector(".auth-inline-error");
    if (!node) {
      node = document.createElement("small");
      node.className = "auth-inline-error";
      fieldWrap.appendChild(node);
    }
    return node;
  };

  const getPasswordStrength = (value) => {
    if (!value) return "none";
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    if (score <= 1) return "weak";
    if (score <= 3) return "medium";
    return "strong";
  };

  const validateControl = (control, form) => {
    const value = (control.value || "").trim();
    const type = (control.getAttribute("type") || "").toLowerCase();
    const id = control.id || "";
    const required = control.required;

    if (required && !value) return { valid: false, message: "This field is required." };

    if (type === "email" && value && !EMAIL_RE.test(value)) {
      return { valid: false, message: "Enter a valid email address." };
    }

    if (id === "id_password1" && value && value.length < 8) {
      return { valid: false, message: "Use at least 8 characters." };
    }

    if (id === "id_password2") {
      const pw1 = form.querySelector("#id_password1");
      if (value && pw1 && value !== pw1.value) {
        return { valid: false, message: "Passwords do not match." };
      }
    }

    return { valid: true, message: "" };
  };

  const applyFieldState = (control, form, showError) => {
    const fieldWrap = control.closest(".auth-field");
    if (!fieldWrap) return true;

    const value = (control.value || "").trim();
    const result = validateControl(control, form);
    const hasServerError = !!fieldWrap.querySelector(".auth-error");
    const shouldMarkValid = result.valid && value.length > 0 && !hasServerError;

    fieldWrap.classList.toggle("is-valid", shouldMarkValid);
    fieldWrap.classList.toggle("is-invalid", !result.valid && (showError || value.length > 0));
    fieldWrap.classList.toggle("show-error", showError && !result.valid);

    const inlineNode = getInlineErrorNode(fieldWrap);
    if (showError && !result.valid) {
      inlineNode.textContent = result.message;
      inlineNode.classList.add("is-visible");
    } else {
      inlineNode.textContent = "";
      inlineNode.classList.remove("is-visible");
    }

    return result.valid;
  };

  const updateStrengthBar = (form) => {
    const input = form.querySelector("#id_password1");
    const bar = form.querySelector(".password-strength-bar");
    if (!input || !bar) return;

    const level = getPasswordStrength(input.value || "");
    bar.classList.remove("level-weak", "level-medium", "level-strong");
    if (level !== "none") {
      bar.classList.add(`level-${level}`);
    }
  };

  const updateProgress = (form, controls) => {
    const fill = form.querySelector(".auth-progress-fill");
    const text = form.querySelector(".auth-progress-text");
    if (!fill || !text) return;

    const required = controls.filter((control) => control.required);
    if (!required.length) return;

    const complete = required.filter((control) => {
      const value = (control.value || "").trim();
      if (!value) return false;
      return validateControl(control, form).valid;
    }).length;

    const percent = Math.round((complete / required.length) * 100);
    fill.style.width = `${percent}%`;
    text.textContent = `${complete} of ${required.length} fields complete`;
  };

  const initAuthEnhancements = () => {
    const forms = document.querySelectorAll(".auth-card");
    if (!forms.length) return;

    forms.forEach((form) => {
      const controls = getControls(form);
      if (!controls.length) return;

      controls.forEach((control) => {
        control.addEventListener("input", () => {
          applyFieldState(control, form, false);
          updateStrengthBar(form);
          updateProgress(form, controls);
        });

        control.addEventListener("change", () => {
          applyFieldState(control, form, false);
          updateStrengthBar(form);
          updateProgress(form, controls);
        });

        control.addEventListener("blur", () => {
          applyFieldState(control, form, true);
          updateStrengthBar(form);
          updateProgress(form, controls);
        });
      });

      updateStrengthBar(form);
      updateProgress(form, controls);
    });
  };

  document.addEventListener("DOMContentLoaded", initAuthEnhancements);
})();
