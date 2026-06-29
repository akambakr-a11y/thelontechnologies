"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { IconArrowRight, IconCheck, IconBolt } from "@/components/ui/icons";

type Status = "idle" | "submitting" | "success" | "error";

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
};

const empty: FormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  message: "",
};

export function Contact() {
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const update =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const valid =
    form.name.trim().length > 1 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.message.trim().length > 4;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || status === "submitting") return;
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Something went wrong.");
      setStatus("success");
      setForm(empty);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <Section id="contact">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Left: pitch */}
        <div>
          <Eyebrow>Contact</Eyebrow>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Let&apos;s build something that ships.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            Tell us what you&apos;re working on. We&apos;ll get back to you within
            24 hours with a clear next step — no sales runaround.
          </p>

          <div className="mt-8 space-y-4">
            <ContactRow label="Location" value="Ontario, Canada" />
            <div className="inline-flex items-center gap-2 rounded-xl border border-line bg-band px-4 py-3 text-sm font-medium text-ink-soft">
              <IconBolt className="h-4 w-4 text-primary" />
              24-hour response, always.
            </div>
          </div>
        </div>

        {/* Right: form card */}
        <div className="relative rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[22rem] flex-col items-center justify-center text-center"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                  className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-glow"
                >
                  <IconCheck className="h-8 w-8" />
                </motion.span>
                <h3 className="mt-5 text-xl font-semibold text-ink">Message sent</h3>
                <p className="mt-2 max-w-xs text-sm text-muted">
                  Thanks — we&apos;ve got it. Expect a reply at the email you
                  provided within 24 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm font-semibold text-primary hover:underline"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={onSubmit}
                className="grid gap-4 sm:grid-cols-2"
                noValidate
              >
                <Field label="Name" className="sm:col-span-1">
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={update("name")}
                    placeholder="Jane Cooper"
                    className={inputCls}
                  />
                </Field>
                <Field label="Email" className="sm:col-span-1">
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    placeholder="jane@company.com"
                    className={inputCls}
                  />
                </Field>
                <Field label="Company" className="sm:col-span-1" optional>
                  <input
                    type="text"
                    value={form.company}
                    onChange={update("company")}
                    placeholder="Acme Inc."
                    className={inputCls}
                  />
                </Field>
                <Field label="Phone" className="sm:col-span-1" optional>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={update("phone")}
                    placeholder="+1 (555) 000-0000"
                    className={inputCls}
                  />
                </Field>
                <Field label="Message" className="sm:col-span-2">
                  <textarea
                    required
                    value={form.message}
                    onChange={update("message")}
                    rows={4}
                    placeholder="Tell us about your project…"
                    className={`${inputCls} resize-none`}
                  />
                </Field>

                {status === "error" && (
                  <p className="sm:col-span-2 text-sm text-[#d23b3b]">{error}</p>
                )}

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={!valid || status === "submitting"}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 py-3.5 text-sm font-semibold text-white shadow-lift transition-all hover:bg-primary hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-ink disabled:hover:shadow-lift"
                  >
                    {status === "submitting" ? (
                      <>
                        <Spinner /> Sending…
                      </>
                    ) : (
                      <>
                        Send message
                        <IconArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                  <p className="mt-3 text-center text-xs text-muted">
                    We&apos;ll only use your details to reply. No spam, ever.
                  </p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

const inputCls =
  "w-full rounded-xl border border-line bg-band px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-muted/70 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10";

function Field({
  label,
  children,
  className = "",
  optional = false,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
  optional?: boolean;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
        {label}
        {optional && <span className="font-normal text-muted">(optional)</span>}
      </span>
      {children}
    </label>
  );
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </>
  );
  return href ? (
    <a href={href} className="flex flex-col transition-colors hover:text-primary">
      {inner}
    </a>
  ) : (
    <div className="flex flex-col">{inner}</div>
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
  );
}
