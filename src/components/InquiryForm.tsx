"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { hasWhatsApp, siteConfig, whatsappHref } from "@/data/site";
import {
  INQUIRY_SERVICE_EVENT,
  INQUIRY_SERVICE_KEY,
  inquiryServiceOptions,
  isKnownService,
} from "@/lib/inquiry";
import { ArrowRight, WhatsAppIcon } from "@/components/ui/Icons";

type FormState = {
  name: string;
  phone: string;
  service: string;
  description: string;
  company: string;
};

type FieldName = "name" | "phone" | "service" | "description";

type Errors = Partial<Record<FieldName, string>>;

const emptyForm: FormState = {
  name: "",
  phone: "",
  service: "",
  description: "",
  company: "",
};

function validate(values: FormState): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  const phone = values.phone.trim();
  const description = values.description.trim();
  const digits = phone.replace(/\D/g, "");

  if (name.length < 2) {
    errors.name = "Please enter your name.";
  } else if (name.length > 120) {
    errors.name = "Please keep your name under 120 characters.";
  }

  if (!phone) {
    errors.phone = "Please enter a phone number.";
  } else if (!/^[+()\d\s.-]{7,24}$/.test(phone) || digits.length < 7 || digits.length > 15) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!values.service) {
    errors.service = "Please select the service you need.";
  } else if (!isKnownService(values.service)) {
    errors.service = "Please select a valid service.";
  }

  if (description.length < 10) {
    errors.description = "Tell us a little more about the project.";
  } else if (description.length > 2000) {
    errors.description = "Please keep the description under 2,000 characters.";
  }

  return errors;
}

export default function InquiryForm() {
  const [values, setValues] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [serverMessage, setServerMessage] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    function applyService(service: string) {
      setValues((current) => ({
        ...current,
        service: isKnownService(service) ? service : "Not sure yet",
      }));
      setErrors((current) => ({ ...current, service: undefined }));
      setStatus((current) => (current === "success" ? "idle" : current));
      setServerMessage("");
      setSubmittedName("");
    }

    try {
      const stored = window.sessionStorage.getItem(INQUIRY_SERVICE_KEY);
      if (stored) applyService(stored);
    } catch {
      // Ignore restricted storage contexts.
    }

    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<{ service?: string }>;
      if (customEvent.detail?.service) applyService(customEvent.detail.service);
    };

    window.addEventListener(INQUIRY_SERVICE_EVENT, handler);
    return () => window.removeEventListener(INQUIRY_SERVICE_EVENT, handler);
  }, []);

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
    }

    // The success state is shorter than the form. Keep the scroll positions
    // of the sections below (the footer) accurate after the layout change.
    let innerFrame = 0;
    const frame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(innerFrame);
    };
  }, [status]);

  function updateField(field: keyof FormState, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (field !== "company" && errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    if (status === "error") {
      setStatus("idle");
      setServerMessage("");
    }
  }

  function focusFirstError(nextErrors: Errors) {
    const order: FieldName[] = ["name", "phone", "service", "description"];
    const field = order.find((key) => nextErrors[key]);
    if (!field) return;
    const element = document.getElementById(`inquiry-${field}`);
    element?.focus();
    element?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          phone: values.phone.trim(),
          service: values.service,
          description: values.description.trim(),
          company: values.company,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !payload?.ok) {
        setStatus("error");
        setServerMessage(
          payload?.error ||
            "Something went wrong while sending your inquiry. Please try again, or use WhatsApp or email.",
        );
        return;
      }

      setSubmittedName(values.name.trim().split(/\s+/)[0] ?? "");
      setStatus("success");
      setValues(emptyForm);
      setErrors({});
    } catch {
      setStatus("error");
      setServerMessage(
        "We couldn't reach the studio just now. Please check your connection and try again.",
      );
    }
  }

  function handleWhatsApp() {
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusFirstError(nextErrors);
      return;
    }

    const message = [
      "Hello ARTCO, I would like to inquire about a project.",
      "",
      `Name: ${values.name.trim()}`,
      `Phone: ${values.phone.trim()}`,
      `Service: ${values.service}`,
      `Project: ${values.description.trim()}`,
    ].join("\n");

    const url = whatsappHref(message);
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
      setServerMessage("A WhatsApp window has opened with your inquiry.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border-t border-mist pt-8"
      >
        <p className="eyebrow">Inquiry received</p>
        <h3
          ref={successRef}
          tabIndex={-1}
          className="mt-5 text-[clamp(1.8rem,3.2vw,2.6rem)] font-normal leading-[1.1] tracking-[-0.03em] text-ink focus:outline-none"
        >
          Thank you{submittedName ? `, ${submittedName}` : ""}.
        </h3>
        <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.65] text-slate">
          Your inquiry has been received. We&apos;ll review the details and be in
          touch about next steps.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setSubmittedName("");
          }}
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-electric-purple hover:underline group mt-8"
        >
          Send another inquiry
          <ArrowRight className="transition-transform duration-500 group-hover:translate-x-1" />
        </button>
      </div>
    );
  }

  return (
    <form
      id="inquiry-form"
      noValidate
      onSubmit={handleSubmit}
      className="border-t border-mist pt-8"
    >
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="eyebrow">Project inquiry</p>
        <p className="text-[12px] text-slate">Fields marked * are required.</p>
      </div>

      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <div>
          <label htmlFor="inquiry-name" className="field-label">
            Name <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="inquiry-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="field-input"
            placeholder="Your name"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "inquiry-name-error" : undefined}
            required
          />
          {errors.name ? (
            <p id="inquiry-name-error" className="field-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="inquiry-phone" className="field-label">
            Phone <span aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="inquiry-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="field-input"
            placeholder="+00 000 000 0000"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "inquiry-phone-error" : undefined}
            required
          />
          {errors.phone ? (
            <p id="inquiry-phone-error" className="field-error">
              {errors.phone}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-7">
        <label htmlFor="inquiry-service" className="field-label">
          Service required <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <div className="relative">
          <select
            id="inquiry-service"
            name="service"
            value={values.service}
            onChange={(event) => updateField("service", event.target.value)}
            className="field-input appearance-none pr-8"
            aria-invalid={errors.service ? true : undefined}
            aria-describedby={errors.service ? "inquiry-service-error" : undefined}
            required
          >
            <option value="" disabled>
              Select a service
            </option>
            {inquiryServiceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        {errors.service ? (
          <p id="inquiry-service-error" className="field-error">
            {errors.service}
          </p>
        ) : null}
      </div>

      <div className="mt-7">
        <label htmlFor="inquiry-description" className="field-label">
          Project description <span aria-hidden="true">*</span>
          <span className="sr-only">(required)</span>
        </label>
        <textarea
          id="inquiry-description"
          name="description"
          rows={4}
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          className="field-input min-h-[124px] resize-y"
          placeholder="Tell us about the idea, the materials you have in mind and any timing."
          aria-invalid={errors.description ? true : undefined}
          aria-describedby={
            errors.description ? "inquiry-description-error" : undefined
          }
          required
        />
        {errors.description ? (
          <p id="inquiry-description-error" className="field-error">
            {errors.description}
          </p>
        ) : null}
      </div>

      <div className="sr-only" aria-hidden="true">
        <label htmlFor="inquiry-company">Company</label>
        <input
          id="inquiry-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(event) => updateField("company", event.target.value)}
        />
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary group min-w-[11rem] disabled:cursor-wait disabled:opacity-60"
        >
          {status === "submitting" ? "Sending inquiry…" : "Submit Inquiry"}
          <ArrowRight className="transition-transform duration-500 group-hover:translate-x-1" />
        </button>

        {hasWhatsApp ? (
          <button
            type="button"
            onClick={handleWhatsApp}
            className="btn-ghost group"
          >
            <WhatsAppIcon size={17} />
            Send via WhatsApp
          </button>
        ) : null}
      </div>

      <div aria-live="polite" className="min-h-[1.5rem]">
        {status === "error" && serverMessage ? (
          <p className="mt-4 max-w-[56ch] text-[13px] leading-[1.5]" style={{ color: "var(--rust)" }}>
            {serverMessage}
          </p>
        ) : null}
        {status !== "error" && serverMessage ? (
          <p className="mt-4 max-w-[56ch] text-[13px] leading-[1.5] text-slate">
            {serverMessage}
          </p>
        ) : null}
      </div>

      <p className="mt-4 max-w-[54ch] text-[12px] leading-[1.6] text-slate">
        Your details are only used to respond to this inquiry. No prices or
        commitments are shared until the brief is understood.
      </p>
    </form>
  );
}
