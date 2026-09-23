import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { submitDonationPledge } from "@/lib/submissions.functions";
import { IYSF, Nav, Footer } from "../components/site-chrome";

export const Route = createFileRoute("/donate")({
  component: DonatePage,
  head: () => ({
    meta: [
      { title: "Donate — IYSF" },
      {
        name: "description",
        content:
          "Support IYSF's campaign for Olympic recognition of Yogasana sport, athlete scholarships and judge certification.",
      },
      { property: "og:title", content: "Donate — IYSF" },
      {
        property: "og:description",
        content: "Support the campaign for Olympic recognition of Yogasana sport.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const PRESETS = [25, 50, 100, 250] as const;

const FUNDS = [
  {
    title: "The Olympic recognition campaign",
    desc: "Supporting IYSF's ongoing work to meet IOC criteria and bring Yogasana to the Olympic stage.",
  },
  {
    title: "Athlete scholarships",
    desc: "Helping athletes from developing federations travel to and compete at world championships.",
  },
  {
    title: "Judge certification subsidies",
    desc: "Reducing the cost of IYSF Academy judge certification for federations building capacity.",
  },
] as const;

function DonatePage() {
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [preset, setPreset] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const submitPledge = useServerFn(submitDonationPledge);

  const amount = preset ?? (customAmount ? Number(customAmount) : null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!amount || amount <= 0) return;
    setSaving(true);
    setSubmitError("");
    try {
      await submitPledge({ data: { full_name: name, email, amount: String(amount), frequency } });
      setSubmitted(true);
    } catch {
      setSubmitError("We couldn't record your pledge. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-dvh bg-[#FAFAFA]" style={{ fontFamily: "var(--font-sans)" }}>
      <Nav />
      <main>
        <div className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-20">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: IYSF.blue }}>
            Support
          </div>
          <h1
            className="mt-3 max-w-[20ch] text-[36px] leading-[1.05] md:text-[60px]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: IYSF.charcoal, letterSpacing: "-0.02em" }}
          >
            Support the campaign for Olympic recognition
          </h1>
          <p className="mt-4 max-w-[70ch] text-[15px] leading-relaxed text-[#414042]">
            Every contribution helps IYSF move closer to Olympic recognition for Yogasana sport, while
            supporting the athletes and judges who compete and officiate under our banner. Read more about{" "}
            <Link to="/about/history" className="font-semibold hover:underline" style={{ color: IYSF.blue }}>
              Toward Olympic recognition
            </Link>
            .
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div className="rounded-lg border border-black/[0.08] bg-white p-6 md:p-8">
              {submitted ? (
                <div role="status" aria-live="polite" className="py-8 text-center">
                  <h2 className="text-2xl font-extrabold" style={{ fontFamily: "var(--font-display)", color: IYSF.charcoal }}>
                    Thank you{name ? `, ${name}` : ""}.
                  </h2>
                  <p className="mx-auto mt-3 max-w-[50ch] text-sm leading-relaxed text-[#414042]">
                    Your pledge has been recorded and the IYSF office will email you the payment
                    details shortly.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
                    <Link to="/" className="text-sm font-semibold hover:underline" style={{ color: IYSF.blue }}>
                      Back to home
                    </Link>
                    <Link to="/about/history" className="text-sm font-semibold hover:underline" style={{ color: IYSF.magenta }}>
                      Toward Olympic recognition
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold text-[#414042]">Frequency</legend>
                    <div className="flex gap-3">
                      {(["once", "monthly"] as const).map((f) => (
                        <label
                          key={f}
                          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors"
                          style={{
                            borderColor: frequency === f ? IYSF.blue : "rgba(0,0,0,0.15)",
                            background: frequency === f ? "rgba(66,152,211,0.08)" : "#fff",
                            color: frequency === f ? IYSF.blue : "#414042",
                          }}
                        >
                          <input
                            type="radio"
                            name="frequency"
                            value={f}
                            checked={frequency === f}
                            onChange={() => setFrequency(f)}
                            className="sr-only"
                          />
                          {f === "once" ? "One-time" : "Monthly"}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold text-[#414042]">Amount (USD)</legend>
                    <div className="grid grid-cols-4 gap-3">
                      {PRESETS.map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setPreset(p);
                            setCustomAmount("");
                          }}
                          aria-pressed={preset === p}
                          className="rounded-md border px-3 py-2.5 text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]/40"
                          style={{
                            borderColor: preset === p ? IYSF.blue : "rgba(0,0,0,0.15)",
                            background: preset === p ? IYSF.blue : "#fff",
                            color: preset === p ? "#fff" : "#414042",
                          }}
                        >
                          ${p}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3">
                      <label htmlFor="custom-amount" className="mb-1.5 block text-sm font-semibold text-[#414042]">
                        Custom amount
                      </label>
                      <input
                        id="custom-amount"
                        type="number"
                        min={1}
                        inputMode="decimal"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setPreset(null);
                        }}
                        placeholder="Enter another amount"
                        className="w-full rounded-md border border-black/15 bg-white px-3.5 py-2.5 text-sm text-[#414042] focus:border-[#4298D3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]/30"
                      />
                    </div>
                  </fieldset>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="donor-name" className="mb-1.5 block text-sm font-semibold text-[#414042]">
                        Name
                      </label>
                      <input
                        id="donor-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-md border border-black/15 bg-white px-3.5 py-2.5 text-sm text-[#414042] focus:border-[#4298D3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]/30"
                      />
                    </div>
                    <div>
                      <label htmlFor="donor-email" className="mb-1.5 block text-sm font-semibold text-[#414042]">
                        Email
                      </label>
                      <input
                        id="donor-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-md border border-black/15 bg-white px-3.5 py-2.5 text-sm text-[#414042] focus:border-[#4298D3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4298D3]/30"
                      />
                    </div>
                  </div>

                  {submitError && <p role="alert" className="text-sm font-semibold text-[#DE007A]">{submitError}</p>}
                  <button
                    type="submit"
                    disabled={saving || !amount}
                    className="w-full rounded-[10px] px-4 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A2400]/40"
                    style={{ background: IYSF.orange }}
                  >
                    {saving ? "Recording…" : `Donate ${amount ? `$${amount}` : ""}`}
                    {frequency === "monthly" ? " / month" : ""}
                  </button>
                  <p className="text-xs text-[#414042]">
                    We record your pledge and email you the payment details — no card details are taken here.
                  </p>
                </form>
              )}
            </div>

            <div className="rounded-lg border border-black/[0.08] bg-white p-6 md:p-8">
              <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: IYSF.charcoal }}>
                What your donation funds
              </h2>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#414042]">
                How contributions are allocated
              </p>
              <ul className="mt-4 space-y-5">
                {FUNDS.map((f) => (
                  <li key={f.title}>
                    <h3 className="text-sm font-bold text-[#414042]">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#414042]">{f.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
