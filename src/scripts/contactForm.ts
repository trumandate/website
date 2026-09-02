// contactForm.ts — client-side validation, the honeypot short-circuit and
// the fetch submission path for ContactForm.astro (spec §6: "Posts to
// Formspree with fetch, inline success and error states in both
// languages").
//
// `form.noValidate = true` runs first, and only ever runs if this script has
// loaded and executed at all — which is exactly the condition under which
// the code below can also take over announcing errors accessibly. A
// JS-disabled reader never reaches this line, so the plain
// `<form action method="POST">` (ContactForm.astro) keeps the browser's own
// `required`/`type="email"` constraint validation as its enforcement layer
// instead, and the submission still reaches Formspree without this file.
//
// Validation pattern (task spec, item 4): one assertive, focus-moved summary
// region (`role="alert"`, `#form-status`) answering "what's wrong, in one
// list", PLUS `aria-describedby` + `aria-invalid` per field answering "which
// field, and why" — the two-part pattern WCAG's own techniques (G83/G85 +
// ARIA19) describe together rather than as alternatives. No GSAP here: this
// file has nothing to do with `prefers-reduced-motion` (spec §7's six
// motions), so it doesn't route through motion.ts's `whenMotionSafe`.
import { ui } from "../i18n/ui";
import type { Language } from "../i18n/types";

const form = document.querySelector<HTMLFormElement>("[data-contact-form]");

if (form) {
  // <html lang> is BaseLayout.astro's own source of truth for the page's
  // language — reusing it here means this script needs no per-page prop
  // threaded through Astro.
  const lang = document.documentElement.lang === "ar" ? "ar" : "en";
  const strings = ui[lang as Language].contact;

  form.noValidate = true;

  const statusEl = form.querySelector<HTMLElement>("[data-form-status]");
  const submitButton = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );
  const submitLabelEl = submitButton?.querySelector<HTMLElement>(
    "[data-submit-label]",
  );
  const restLabel = submitLabelEl?.textContent ?? "";

  interface FieldSpec {
    name: string;
    errorId: string;
    /** The real, focusable element the error-summary link jumps to — the
     * field's own id for the three text inputs, the fieldset's id for the
     * radio group (which has no single input id of its own). */
    anchorId: string;
    label: string;
    kind: "text" | "email" | "radio";
  }

  const fields: FieldSpec[] = [
    {
      name: "name",
      errorId: "contact-name-error",
      anchorId: "contact-name",
      label: strings.nameLabel,
      kind: "text",
    },
    {
      name: "organisation",
      errorId: "contact-organisation-error",
      anchorId: "contact-organisation",
      label: strings.orgLabel,
      kind: "text",
    },
    {
      name: "email",
      errorId: "contact-email-error",
      anchorId: "contact-email",
      label: strings.emailLabel,
      kind: "email",
    },
    {
      name: "interest",
      errorId: "interest-error",
      anchorId: "interest-group",
      label: strings.interestLegend,
      kind: "radio",
    },
  ];

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /** Sets (or clears, when `message` is empty) one field's error text and
   * its `aria-invalid` state. The error paragraph's `min-height` (FormField
   * .astro) is what keeps this from ever shifting the layout below it. */
  function setFieldError(errorId: string, message: string, input: Element | null) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) {
      errorEl.replaceChildren();
      if (message) {
        // The colour cue is supplementary, never the only signal — the text
        // node right after it is what a screen reader and a sighted reader
        // relying on greyscale both get (RagDot.astro's own principle).
        const dot = document.createElement("span");
        dot.setAttribute("aria-hidden", "true");
        // 2026-09-01: `red-deep`, not `red`. On the light card `red`
        // (#E0574C) measures 3.5:1 against `form-paper` — fine for a
        // graphical dot under 1.4.11's 3:1 rule, but the error TEXT beside it
        // now carries the same colour and needs 4.5:1, so both use the one
        // token rather than drifting apart.
        dot.className =
          "me-2 inline-block size-2 rounded-full bg-red-deep align-middle";
        errorEl.append(dot, document.createTextNode(message));
      }
    }
    input?.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validate(): {
    valid: boolean;
    summary: Array<{ anchorId: string; label: string }>;
  } {
    const summary: Array<{ anchorId: string; label: string }> = [];
    const data = new FormData(form as HTMLFormElement);

    for (const field of fields) {
      if (field.kind === "radio") {
        const checked = form!.querySelector<HTMLInputElement>(
          `input[name="${field.name}"]:checked`,
        );
        const group = document.getElementById(field.anchorId);
        if (!checked) {
          setFieldError(field.errorId, strings.requiredError, group);
          summary.push({ anchorId: field.anchorId, label: field.label });
        } else {
          setFieldError(field.errorId, "", group);
        }
        continue;
      }

      const input = document.getElementById(field.anchorId);
      const value = String(data.get(field.name) ?? "").trim();

      if (!value) {
        setFieldError(field.errorId, strings.requiredError, input);
        summary.push({ anchorId: field.anchorId, label: field.label });
      } else if (field.kind === "email" && !emailPattern.test(value)) {
        setFieldError(field.errorId, strings.emailError, input);
        summary.push({ anchorId: field.anchorId, label: field.label });
      } else {
        setFieldError(field.errorId, "", input);
      }
    }

    return { valid: summary.length === 0, summary };
  }

  function showStatus(
    kind: "error-summary" | "success" | "submit-error",
    detail?: Array<{ anchorId: string; label: string }>,
  ) {
    if (!statusEl) return;
    statusEl.replaceChildren();

    const isPositive = kind === "success";
    // P10 (DESIGN-ELEVATION.md §4.5): this REPLACES the class list wholesale
    // on every call, so the shadow/transition classes ContactForm.astro's
    // static markup carries have to be repeated here, or they'd be dropped
    // the first time any status is shown. Keep the two in step — the static
    // list is the at-rest default, this one is every shown state.
    //
    // 2026-09-01 contact-form redesign: retinted for the light card. The
    // ground now differs per outcome (`form-tint` for success, `form-alert`
    // for either failure) so the state is legible before a word is read, and
    // the 2px inline-start marker still carries the accent/red distinction
    // for anyone who cannot separate the two grounds. Both grounds are light
    // enough that `form-ink`/`form-body` keep their measured ratios on them:
    // form-ink 13.7:1 on form-tint and 13.4:1 on form-alert.
    statusEl.className = [
      "mt-8 rounded-field border border-form-rule border-s-marker p-5",
      "shadow-field focus-visible:outline-accent-deep motion-safe:transition-[opacity,transform] motion-safe:duration-state motion-safe:ease-micro",
      isPositive
        ? "bg-form-tint border-s-accent-deep"
        : "bg-form-alert border-s-red-deep",
    ].join(" ");

    const heading = document.createElement("p");
    heading.className = "font-sans text-h3 font-semi text-form-ink";

    if (kind === "success") {
      heading.textContent = strings.successHeading;
      const body = document.createElement("p");
      body.className = "mt-2 text-body font-light text-form-body";
      body.textContent = strings.successBody;
      statusEl.append(heading, body);
    } else if (kind === "submit-error") {
      heading.textContent = strings.errorHeading;
      const body = document.createElement("p");
      body.className = "mt-2 text-body font-light text-form-body";
      body.textContent = strings.errorBody;
      statusEl.append(heading, body);
    } else {
      heading.textContent = strings.errorSummaryHeading;
      const list = document.createElement("ul");
      list.className =
        "mt-2 list-inside list-disc text-body font-light text-form-body";
      for (const item of detail ?? []) {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#${item.anchorId}`;
        link.textContent = item.label;
        // `form-ink` rather than the inherited `form-body`, so a jump link
        // is the darkest, heaviest text in its own list item (13.4:1 on the
        // `form-alert` ground). The underline is what actually distinguishes
        // it without colour, per 1.4.1; weight and darkness are the
        // supplementary cues, not the load-bearing ones.
        link.className =
          "font-semi text-form-ink underline underline-offset-4 hover:text-accent-deep focus-visible:outline-accent-deep";
        li.append(link);
        list.append(li);
      }
      statusEl.append(heading, list);
    }

    statusEl.hidden = false;
    // P10 (DESIGN-ELEVATION.md §4.5): fade and rise the region in (and
    // re-run it on every replacement — error-summary → success, etc.) via
    // the `motion-safe:transition-[opacity,transform]` class the
    // markup/className above always carries. Reset to opacity 0 / 4px down
    // first so a repeated call (content already visible, being replaced)
    // animates again rather than snapping. One frame's wait (rAF) so the
    // browser registers the start state before animating to the end one — a
    // synchronous flip in the same tick would never transition. Purely a CSS
    // toggle, not a GSAP tween, so this needs no whenMotionSafe gate of its
    // own: `motion-safe:` on the class already removes both properties from
    // the cascade under `prefers-reduced-motion: reduce`, and the assertive
    // announcement/focus move below are unaffected either way.
    statusEl.style.opacity = "0";
    statusEl.style.transform = "translateY(4px)";
    requestAnimationFrame(() => {
      statusEl.style.opacity = "1";
      statusEl.style.transform = "translateY(0)";
    });
    // Assertive `role="alert"` announces the content change on its own in
    // every browser/AT combination tested (P7 QA); the explicit focus move
    // is the belt-and-braces guarantee, and it's what actually delivers a
    // reader to the summary's jump links rather than leaving focus wherever
    // the submit click left it.
    statusEl.focus();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const honeypot = form!.querySelector<HTMLInputElement>('[name="_gotcha"]');
    if (honeypot && honeypot.value) {
      // A human can never reach this field (visually hidden, aria-hidden,
      // tabindex="-1"); only a bot filling every input it finds gets here.
      // Formspree's own `_gotcha` handling already discards this server-side
      // on the no-JS path — this is a client-side belt-and-braces skip that
      // also avoids spending a real network request on it, and shows the
      // ordinary success state so an unsophisticated bot gets no signal that
      // anything was rejected.
      showStatus("success");
      form!.reset();
      return;
    }

    const { valid, summary } = validate();
    if (!valid) {
      showStatus("error-summary", summary);
      return;
    }

    statusEl?.setAttribute("hidden", "");

    if (submitButton) {
      submitButton.disabled = true;
      if (submitLabelEl) submitLabelEl.textContent = strings.submittingLabel;
    }

    fetch(form!.action, {
      method: "POST",
      body: new FormData(form as HTMLFormElement),
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          showStatus("success");
          form!.reset();
        } else {
          showStatus("submit-error");
        }
      })
      .catch(() => {
        showStatus("submit-error");
      })
      .finally(() => {
        if (submitButton) {
          submitButton.disabled = false;
          if (submitLabelEl) submitLabelEl.textContent = restLabel;
        }
      });
  });
}

export {};
