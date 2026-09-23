import { createFileRoute } from "@tanstack/react-router";
import { Quote } from "lucide-react";
import sponsorshipPosterAsset from "../assets/2026-sponsorship-poster.webp.asset.json";
import { PageHeader, PageShell, Prose, Section } from "../components/page-shell";
import { IYSF } from "../components/site-chrome";
import { InquiryForm } from "../components/inquiry-form";

export const Route = createFileRoute("/sponsorship")({
  head: () => ({
    meta: [
      { title: "Sponsorship | IYSF" },
      {
        name: "description",
        content: "Support the IYSF World Yoga Asana Championships and help athletes from every generation compete on the world stage.",
      },
      { property: "og:title", content: "Sponsorship | IYSF" },
      {
        property: "og:description",
        content: "Become an IYSF World Yoga Asana Championships sponsor and support the global Yogasana sports community.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SponsorshipPage,
});

function SponsorButtons() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a
        href="#sponsor-inquiry"
        className="inline-flex justify-center rounded-[12px] px-6 py-3.5 text-[15px] font-bold transition-transform hover:-translate-y-0.5"
        style={{ background: IYSF.orange, color: IYSF.charcoal }}
      >
        Studio Sponsor
      </a>
      <a
        href="#sponsor-inquiry"
        className="inline-flex justify-center rounded-[12px] border-2 px-6 py-3 text-[15px] font-bold transition-colors hover:bg-[rgba(66,152,211,0.08)]"
        style={{ borderColor: IYSF.blue, color: IYSF.blue }}
      >
        Silver Sponsor
      </a>
    </div>
  );
}

function SponsorshipPage() {
  return (
    <PageShell>
      <PageHeader kicker="Support the championship" title="Sponsorship" />

      <Section>
        <div className="max-w-[820px]">
          <img
            src={sponsorshipPosterAsset.url}
            alt="2026 IYSF World Yogasana Championship sponsorship opportunities: Studio Sponsor and Silver Sponsor"
            className="w-full rounded-[12px] border"
            style={{ borderColor: IYSF.blueLine, boxShadow: IYSF.blueShadow }}
          />
          <div className="mt-6">
            <SponsorButtons />
          </div>
        </div>
      </Section>

      <Section>
        <div id="sponsor-inquiry" className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-[24px] md:text-[30px]" style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: IYSF.charcoal }}>Become a sponsor</h2>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: IYSF.charcoal }}>Tell us about your organisation and preferred sponsorship level. The IYSF team will follow up with availability and next steps.</p>
          </div>
          <InquiryForm kind="sponsorship" />
        </div>
      </Section>

      <Section tint>
        <Prose>
          <p>Dear Friends,</p>

          <p>It is with great excitement, humility, and a deeply grateful heart that I invite you to join us for the <strong>17th IYSF World Yoga Asana Championships.</strong></p>

          <p>Seventeen World Championships when I look back, I often ask myself how a dream that began in <strong>2003</strong> could have come this far.</p>

          <p>At that time, it was simply an idea in my heart to create a healthy sport through Yoga Asana, where children, adults, and Masters could challenge themselves, develop discipline, learn respect, and, most importantly, <strong>become better human beings.</strong></p>

          <p>What once seemed like an impossible dream has now become a global journey.</p>

          <p>And how can I forget that <strong>Yoga Asana is a beautiful gift from India to the world.</strong> I feel deeply fortunate that this journey has been carried forward through the wisdom, discipline, and teachings of the great teachers who came before us. They taught us not only Yoga, but also the values, discipline, and dedication needed to organize and conduct a competition with integrity.</p>

          <p><strong>Their teachings are the foundation upon which we continue to build.</strong></p>

          <p>And I know very clearly that <strong>I did not build this alone.</strong></p>

          <p>Every Federation President, every athlete, every coach, every teacher, every parent, every volunteer, and every supporter who trusted this vision has helped carry IYSF forward. Your friendship and trust have given this movement its strength.</p>

          <blockquote
            className="my-8 rounded-[10px] border-l-[3px] px-5 py-5 text-[20px] leading-snug"
            style={{ background: "#fff", borderColor: IYSF.magenta, color: IYSF.charcoal, fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            <Quote size={20} color={IYSF.magenta} className="mb-3" aria-hidden="true" />
            This is our journey. This is our celebration.
          </blockquote>

          <p>This year, we are opening the doors even wider from our youngest athletes to our Masters because Yoga Asana belongs to every generation. I want this World Competition to be a gathering where we don't simply witness extraordinary performances, but where we celebrate <strong>discipline, courage, friendship, unity, and the human spirit.</strong></p>

          <h2
            className="pt-6 text-[24px] leading-tight md:text-[28px]"
            style={{ color: IYSF.charcoal, fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            A Humble Request for Your Support
          </h2>

          <p>As you know, IYSF is a <strong>nonprofit organization</strong>, and creating an international event of this scale requires the support of our global community.</p>

          <p>For the first time, we are offering special opportunities for <strong>yoga studios, wellness centers, boutiques, startups, and businesses beyond yoga</strong> to become part of the World Competition through sponsorship and global promotion.</p>

          <p>If you or someone in your community has a business that would like to reach an international audience, I humbly ask you to consider supporting IYSF through one of these opportunities.</p>

          <p>Your sponsorship does more than promote a business. <strong>It helps us bring athletes together, create opportunities for the next generation, and continue the mission we started more than two decades ago.</strong></p>

          <p>The opportunities are limited, so I encourage you to reserve your place early. All details are available on the IYSF website.</p>

          <p>We also kindly ask that sponsors do not send physical products for us to carry internationally, as customs regulations make this very difficult. Promotional opportunities are available without requiring us to transport products.</p>

          <p>Yoga enthusiast, I ask you not only to come yourselves, but to <strong>bring your community with you.</strong> Encourage your studios, athletes, families, and businesses to participate and support this historic gathering.</p>

          <p>Let us show the world what happens when we come together with one purpose:</p>

          <blockquote
            className="my-8 rounded-[10px] border-l-[3px] px-5 py-5 text-[20px] leading-relaxed"
            style={{ background: "#fff", borderColor: IYSF.orange, color: IYSF.charcoal, fontFamily: "var(--font-display)", fontWeight: 800 }}
          >
            <Quote size={20} color={IYSF.orange} className="mb-3" aria-hidden="true" />
            <span className="block">Unity through Yoga Asana.</span>
            <span className="block">Discipline through Sport.</span>
            <span className="block">And humanity beyond all boundaries.</span>
          </blockquote>

          <p>I look forward to welcoming you personally, sharing this special moment with you, and celebrating everything we have built together.</p>

          <p>From my heart, <strong>thank you for believing in the dream, carrying the teachings of our great teachers, and helping us share this gift from India with the world.</strong></p>

          <p>With deepest gratitude, love, and respect,</p>

          <p><strong>Rajashree Choudhury</strong><br />President<br /><strong>International Yoga Sports Federation (IYSF)</strong></p>

          <div className="pt-5">
            <SponsorButtons />
          </div>
        </Prose>
      </Section>
    </PageShell>
  );
}