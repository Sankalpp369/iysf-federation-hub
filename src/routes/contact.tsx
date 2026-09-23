import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, PageHeader, Section, Prose } from "../components/page-shell";
import { IYSF } from "../components/site-chrome";
import { InquiryForm } from "../components/inquiry-form";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact IYSF — General Inquiries" },
      {
        name: "description",
        content:
          "Get in touch with the International Yoga Sports Federation office in Lausanne, Switzerland. All inquiries are routed through our general form.",
      },
      { property: "og:title", content: "Contact IYSF" },
      {
        property: "og:description",
        content: "Reach the IYSF office in Lausanne with a general inquiry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell>
      <PageHeader
        kicker="Contact"
        title="Get in touch"
        sub="All inquiries — athletes, coaches, judges, media and prospective member federations — are routed through the IYSF office."
      />

      <Section>
        <div className="grid gap-10 md:grid-cols-[1fr_1.1fr]">
          <div>
            <Prose>
              <p>
                We don't publish personal email addresses for officials, judges or coaches. Use the
                form and your message will reach the right part of the federation.
              </p>
              <p>
                Athletes should normally contact their national federation first — you can find yours
                in the{" "}
                <Link
                  to="/directory"
                  className="font-semibold hover:underline"
                  style={{ color: IYSF.blue }}
                >
                  federation directory
                </Link>
                .
              </p>
            </Prose>
            <div
              className="mt-8 rounded-[12px] border bg-white p-6"
              style={{ borderColor: IYSF.blueLine }}
            >
              <div
                className="text-[10.5px] font-bold uppercase tracking-[0.2em]"
                style={{ color: IYSF.charcoal }}
              >
                Headquarters
              </div>
              <address
                className="mt-3 text-sm not-italic leading-relaxed"
                style={{ color: "#3a3a3a" }}
              >
                International Yoga Sports Federation
                <br />
                Maison du Sport International
                <br />
                Av de Rhodanie 54
                <br />
                Lausanne, Switzerland
              </address>
            </div>
          </div>
          <div>
            <h2
              className="text-[22px] md:text-[26px]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#414042" }}
            >
              Send an inquiry
            </h2>
            <p className="mt-2 text-sm" style={{ color: IYSF.charcoal }}>
              Tell us what you need and the IYSF office will route your message to the right team.
            </p>
            <div className="mt-6">
              <InquiryForm kind="contact" />
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}