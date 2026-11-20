/* Académie d'Armes: site behavior (no dependencies) */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  function setNav(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); toggle.focus(); }
    });
  }

  /* ---------- Document links: show "Coming soon" when the PDF isn't uploaded yet ---------- */
  document.querySelectorAll("[data-doc]").forEach(function (link) {
    var href = link.getAttribute("href");
    fetch(href, { method: "HEAD", cache: "no-store" })
      .then(function (res) {
        var type = res.headers.get("content-type") || "";
        // On Netlify, missing docs are rewritten to a small text placeholder (see netlify.toml),
        // so anything that isn't a real PDF counts as "not uploaded yet".
        if (!res.ok || type.indexOf("application/pdf") === -1) markMissing(link);
      })
      .catch(function () { markMissing(link); });
  });
  function markMissing(link) {
    link.classList.add("is-missing");
    link.removeAttribute("href");
    link.removeAttribute("target");
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("role", "link");
    var status = link.querySelector(".doc-status");
    if (status) status.textContent = "Coming soon";
  }

  /* ---------- Contact form (Web3Forms) ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;
  var statusEl = document.getElementById("form-status");
  var submitBtn = form.querySelector('button[type="submit"]');
  var cfg = window.SITE_CONFIG || {};

  var rules = {
    name: function (v) { return v.trim() ? "" : "Please enter your name."; },
    email: function (v) {
      if (!v.trim()) return "Please enter your email.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address.";
    },
    phone: function (v) {
      if (!v.trim()) return "";
      return (v.replace(/\D/g, "").length >= 10) ? "" : "Please enter a full phone number, or leave it blank.";
    },
    interest: function (v) { return v ? "" : "Please choose an option."; },
    message: function (v) { return v.trim().length >= 5 ? "" : "Please add a short message."; }
  };

  function validateField(el) {
    var rule = rules[el.name];
    if (!rule) return true;
    var msg = rule(el.value);
    var err = document.getElementById(el.id + "-err");
    if (msg) {
      el.setAttribute("aria-invalid", "true");
      el.setAttribute("aria-describedby", el.id + "-err");
      err.textContent = msg; err.hidden = false;
    } else {
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
      err.textContent = ""; err.hidden = true;
    }
    return !msg;
  }

  Object.keys(rules).forEach(function (name) {
    var el = form.elements[name];
    el.addEventListener("blur", function () { if (el.value || el.hasAttribute("aria-invalid")) validateField(el); });
    el.addEventListener("input", function () { if (el.hasAttribute("aria-invalid")) validateField(el); });
  });

  function showStatus(kind, text) {
    statusEl.className = "form-status is-" + kind;
    statusEl.textContent = text;
    statusEl.hidden = false;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    statusEl.hidden = true;

    var firstBad = null;
    Object.keys(rules).forEach(function (name) {
      var el = form.elements[name];
      if (!validateField(el) && !firstBad) firstBad = el;
    });
    if (firstBad) { firstBad.focus(); return; }

    // Honeypot tripped: pretend success, send nothing.
    if (form.elements.botcheck.checked) {
      form.reset();
      showStatus("success", "Thanks! Your message has been sent.");
      return;
    }

    var key = cfg.web3formsAccessKey || "";
    if (!key || key.indexOf("PASTE_") === 0) {
      showStatus("error", "The contact form isn't connected yet. Please call 609-791-0321.");
      return;
    }

    var payload = {
      access_key: key,
      subject: (cfg.formSubject || "New website message") + " (" + form.elements.interest.value + ")",
      from_name: cfg.formFromName || "Website",
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim() || "Not provided",
      interest: form.elements.interest.value,
      message: form.elements.message.value.trim(),
      botcheck: false
    };

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (r) {
        if (r.ok && r.data && r.data.success) {
          form.reset();
          showStatus("success", "Thanks! Your message has been sent. We’ll be in touch soon.");
        } else {
          throw new Error((r.data && r.data.message) || "Request failed");
        }
      })
      .catch(function () {
        showStatus("error", "Sorry, something went wrong sending your message. Please try again, or call 609-791-0321.");
      })
      .then(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send message";
      });
  });
})();
