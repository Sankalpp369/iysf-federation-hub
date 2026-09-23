import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { submitInquiry } from "@/lib/submissions.functions";
import { IYSF } from "./site-chrome";

const schema = z.object({
  organisation_name: z.string().trim().min(2, "Enter an organisation name").max(120),
  contact_name: z.string().trim().min(2, "Enter your name").max(120),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(40),
  country: z.string().trim().max(80),
  interest: z.string().trim().min(2, "Select a subject").max(120),
  message: z.string().trim().min(10, "Enter at least 10 characters").max(2000),
});

const fieldClass = "mt-1.5 w-full rounded-md border border-black/15 bg-white px-3.5 py-2.5 text-sm text-[#414042] outline-none focus:border-[#4298D3] focus:ring-2 focus:ring-[#4298D3]/20";

export function InquiryForm({ kind }: { kind: "contact" | "sponsorship" }) {
  const submit = useServerFn(submitInquiry);
  const [values, setValues] = useState({
    organisation_name: "",
    contact_name: "",
    email: "",
    phone: "",
    country: "",
    interest: kind === "contact" ? "General inquiry" : "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  const set = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] ??= issue.message;
      setErrors(next);
      document.getElementById(`${kind}-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    setStatus("saving");
    try {
      await submit({ data: {
        ...parsed.data,
        phone: parsed.data.phone || null,
        country: parsed.data.country || null,
      } });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <div role="status" className="rounded-[12px] border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-900">Your inquiry has been received. The IYSF team will follow up by email.</div>;
  }

  const fields = kind === "sponsorship"
    ? ["Studio Sponsor", "Silver Sponsor", "Other sponsorship"]
    : ["General inquiry", "Athlete inquiry", "Coach or judge inquiry", "Media inquiry"];

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
      {([
        ["organisation_name", "Organisation"],
        ["contact_name", "Your name"],
        ["email", "Email"],
        ["phone", "Phone (optional)"],
        ["country", "Country (optional)"],
      ] as const).map(([key, label]) => (
        <label key={key} className={key === "organisation_name" ? "sm:col-span-2" : ""}>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#414042]">{label}</span>
          <input id={`${kind}-${key}`} type={key === "email" ? "email" : "text"} value={values[key]} onChange={set(key)} className={fieldClass} aria-invalid={Boolean(errors[key])} />
          {errors[key] && <span className="mt-1 block text-xs text-[#DE007A]">{errors[key]}</span>}
        </label>
      ))}
      <label className="sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#414042]">Subject</span>
        <select id={`${kind}-interest`} value={values.interest} onChange={set("interest")} className={fieldClass}>
          {kind === "sponsorship" && <option value="">Select an option</option>}
          {fields.map((field) => <option key={field}>{field}</option>)}
        </select>
        {errors.interest && <span className="mt-1 block text-xs text-[#DE007A]">{errors.interest}</span>}
      </label>
      <label className="sm:col-span-2">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#414042]">Message</span>
        <textarea id={`${kind}-message`} rows={5} value={values.message} onChange={set("message")} className={fieldClass} aria-invalid={Boolean(errors.message)} />
        {errors.message && <span className="mt-1 block text-xs text-[#DE007A]">{errors.message}</span>}
      </label>
      {status === "error" && <p role="alert" className="text-sm font-semibold text-[#DE007A] sm:col-span-2">We couldn't submit your inquiry. Please try again.</p>}
      <button type="submit" disabled={status === "saving"} className="w-full rounded-[10px] px-5 py-3 text-sm font-bold disabled:opacity-60 sm:w-fit" style={{ background: IYSF.orange, color: IYSF.charcoal }}>
        {status === "saving" ? "Submitting…" : "Submit inquiry"}
      </button>
    </form>
  );
}