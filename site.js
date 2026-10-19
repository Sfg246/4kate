(() => {
  "use strict";
  const page = document.body.dataset.page;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const toast = document.getElementById("toast");
  let toastTimeout;
  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("on");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("on"), 2700);
  }
  function petals(target, amount = 9) {
    if (reducedMotion || !target) return;
    const rect = target.getBoundingClientRect();
    for (let i = 0; i < amount; i++) {
      const el = document.createElement("span");
      el.className = "petal";
      el.textContent = i % 4 === 0 ? "✿" : "♡";
      el.style.left = rect.left + rect.width * (.2 + Math.random() * .6) + "px";
      el.style.top = rect.top + rect.height / 2 + "px";
      el.style.setProperty("--dx", (Math.random() * 190 - 95) + "px");
      el.style.setProperty("--dy", -(55 + Math.random() * 110) + "px");
      el.style.setProperty("--dr", (Math.random() * 90 - 45) + "deg");
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  }
  document.querySelectorAll("a[data-page-link]").forEach(link => {
    link.addEventListener("click", event => {
      if (reducedMotion || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || link.target) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      event.preventDefault();
      document.body.classList.add("leaving");
      setTimeout(() => { window.location.assign(href); }, 240);
    });
  });
  if (page === "mirror") {
    const cards = document.querySelectorAll(".reveal-card");
    const count = document.getElementById("card-count");
    const everSeen = new Set();
    cards.forEach((card, i) => {
      card.addEventListener("click", () => {
        const on = card.getAttribute("aria-pressed") !== "true";
        card.setAttribute("aria-pressed", String(on));
        card.setAttribute("aria-label", on ? "Hide reminder " + (i + 1) : "Reveal reminder " + (i + 1));
        if (on) { everSeen.add(i); petals(card, 5); }
        count.textContent = everSeen.size + " out of " + cards.length + " reminders found" + (everSeen.size === cards.length ? " · all six are true, by the way ♡" : "");
      });
    });
  }
  if (page === "choose") {
    const drafts = {
      space: {
        title: "a little breathing room",
        text: "I've been feeling overwhelmed, and I need some time and space to think about what I want and what feels right for me. Please respect that I need a little distance right now. I'll reach out when I'm ready to talk."
      },
      boundary: {
        title: "my boundaries matter",
        text: "I care about you, but I need to be clear about something important to me. My boundaries are not up for negotiation. I need a relationship where my choices and my 'no' are respected without pressure or guilt. Please don't ask me to prove my love by crossing my boundaries. If we can't agree on that, I need to reconsider this relationship."
      },
      end: {
        title: "choosing to move forward",
        text: "I've thought a lot about us, and I've realized this relationship isn't giving me the trust, respect, and peace I need. I care about what we've shared, but I'm choosing to end our relationship. This decision isn't easy, and it's final. I need you to respect it and give me space. I wish you well."
      },
      friend: {
        title: "a note to bella",
        text: "hey bella, can we talk? i'm feeling really confused and could use someone in my corner right now. i don't need you to solve anything, i just need my friend. ♡"
      }
    };
    const buttons = document.querySelectorAll("[data-draft]");
    const label = document.getElementById("draft-label");
    const content = document.getElementById("draft-text");
    const copy = document.getElementById("copy-draft");
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        buttons.forEach(b => b.setAttribute("aria-pressed", String(b === button)));
        const draft = drafts[button.dataset.draft];
        label.textContent = draft.title;
        content.textContent = draft.text;
        petals(button, 4);
      });
    });
    copy.addEventListener("click", async () => {
      const text = content.textContent;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const t = document.createElement("textarea");
          t.value = text;
          t.setAttribute("readonly", "");
          t.style.position = "fixed";
          t.style.opacity = "0";
          document.body.appendChild(t);
          t.select();
          const copied = document.execCommand("copy");
          t.remove();
          if (!copied) throw new Error("Clipboard unavailable");
        }
        notify("copied. take your time, kate ♡");
        petals(copy, 9);
      } catch (err) {
        notify("copy didn't work. press and hold the message to select it.");
        content.focus();
      }
    });
    const secret = document.getElementById("final-secret");
    const line = document.getElementById("secret-line");
    secret.addEventListener("click", () => {
      line.hidden = !line.hidden;
      const open = !line.hidden;
      secret.setAttribute("aria-expanded", String(open));
      secret.textContent = open ? "tuck your note away ↑" : "open your last little note ♡";
      if (open) petals(secret, 17);
    });
  }
})();