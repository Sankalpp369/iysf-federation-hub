# IYSF Official Page

Build the homepage for IYSF (International Yoga Sports Federation), an international sports governing body for competitive Yogasana. The site must read as a **professional sports federation** (like World Athletics or FIFA regional sites) with **subtle cultural/yoga-heritage accents** — not a wellness/spa brand, not a generic template.




## Brand system




**Colors — use exactly these, no substitutes:**

- Orange: `#FBAF43`

- Blue: `#4898D3`

- Pink/Magenta: `#EA088C`

- Charcoal (body text, wordmark): `#575757`

- Near-black (headlines): `#14181F`

- Navy (dark sections only, derived for contrast — not from logo): `#16264A`, darker shade `#0D1830`

- White: `#FFFFFF` — dominant background throughout

- Black: pure `#000000` only where explicitly required (rare)




Rule: white/off-white backgrounds dominate (~70% of any view). Orange, blue and pink are mixed freely across sections rather than assigned one-color-per-role — but within a single component, don't use all three at once; pick 1–2 per component so it stays legible, not rainbow-y.




**Typography:**

- Headlines: a bold geometric/expanded sans-serif (e.g. Archivo Expanded, weight 700–800), sentence case or title case, tight letter-spacing

- Body: a clean humanist sans-serif (e.g. Inter), weight 400–500

- Stats, dates, data, rankings: a monospace font (e.g. IBM Plex Mono) — this is a deliberate detail that makes results/data feel official

- No script or decorative "wellness brochure" fonts anywhere




**Logo:** IYSF's existing mark is a stylized human figure with arms raised in a yoga pose (like Tadasana/Urdhva Hastasana), rendered in blue (left arm) and orange (right arm) with a pink circular accent at the sternum/chest point, "IYSF" wordmark in charcoal below. Use as-is; do not redesign. Provide it as an SVG placeholder (simple raised-arms silhouette) if the real logo file isn't supplied yet.




**Overall tone:** Bold and athletic first, cultural/heritage second. Federation-grade — think Olympic pictogram systems and World Athletics' data-driven confidence — not a yoga studio website.




## Page structure (in order)




### 1. Navigation (sticky)

- Left: logo mark + "IYSF" wordmark

- Center/right: About, Events, Results, Members, Academy

- Right: "Join a federation" button (filled orange `#FBAF43`, dark text `#3A2400` for contrast — orange fails contrast with white text)

- Secondary "Log in" as ghost/outline button

- Mobile: collapse nav links behind a hamburger icon; keep the Join CTA visible




### 2. Hero section — MARQUEE CONCEPT (signature element)

This is the one big "wow" moment of the page. Everything else on the page stays calm and flat; all the visual energy lives here.




- White background, centered layout

- Small eyebrow label above headline: "International federation" in blue, uppercase, small letter-spacing, with a small pink dot beside it that gently pulses (opacity animation, ~2s loop)

- Headline (large, bold, centered, 2 lines): **"A practice, judged as a sport."** — sentence case, near-black

- Subhead (centered, muted gray, max-width ~500px): **"IYSF governs competitive Yogasana worldwide — every pose codified, every athlete certified."**

- Two CTAs centered below: "Join a federation" (filled orange, dark text) and "View results" (outline blue, blue text)

- Below the CTAs: a **horizontal marquee strip** — a continuous, seamless, slow (18–22s loop) auto-scrolling row of small (~40–48px) yoga pose icons/silhouettes, alternating through the three brand colors (orange/blue/pink), on a very light gray strip background (`#FAFAFA`) with thin top/bottom hairline borders. This scrolls left continuously, looping seamlessly (duplicate the icon set back-to-back so the loop isn't visible).

  - **PLACEHOLDER**: use simple geometric/abstract pose silhouettes for now (a circle head + basic limb shapes is fine) — these are NOT final art. Label them in code comments as `{/* placeholder pose icon — replace with final illustration */}`.

  - Respect `prefers-reduced-motion`: disable the scroll animation (and the pulsing dot) entirely for users with that setting.




### 3. Mandate/About strip

Two-column layout:

- Left (wider): eyebrow "Our mandate", heading "A sport with heritage, governed to modern standard", one paragraph of body copy about the federation's role (rulebook, judging, certification, Olympic recognition pathway)

- Right (narrower, left border divider): 2–3 stacked "fact" rows — label (small, uppercase, muted) + value (bold). Use `placeholder` as the literal value for: "Governing since", "Recognition status" — these are real facts to be filled in later, do not invent numbers.




### 4. Global reach stats band

Full-width navy (`#16264A`) section, white text, one faint large decorative ring (SVG circle outline, ~8% opacity, slow rotating drift animation, positioned off-canvas top-right) for texture only.

- 4-column stat grid: Member federations / Certified athletes / Championships held / Continents represented

- Each stat: large monospace number in orange, small label below in light blue-gray

- **PLACEHOLDER**: use an em-dash `—` for every number, not a fake number. Add a small caption "placeholder" under each in reduced opacity.




### 5. Upcoming championships

- Section label "Upcoming championships"

- 3-card horizontal row (stack on mobile), each card:

  - Top color block (date, monospace font, white text) — rotate the block color across the 3 cards (pink/blue/orange)

  - Body: event name (placeholder text), location (placeholder text, muted)

- All content explicitly placeholder — real dates/locations not yet available




### 6. Latest news / results

- Section label "Latest news"

- 3-card row, each with a colored top border (rotate orange/blue/pink), a small uppercase category kicker (RESULTS / GOVERNANCE / FEDERATION), and a headline in bold

- Placeholder headlines are fine here as directional examples, not real claims




### 7. CTA band

Full-width orange (`#FBAF43`) band, dark navy or near-black text for contrast. Left: short bold heading "Ready to compete under the IYSF banner?" Right: dark filled button "Become a member federation"




### 8. Footer

Dark navy/near-black background, white/muted text. Logo + one-line description, link columns (Federation / Compete / Connect), social icons, copyright line.




## Interaction & motion rules

- The marquee scroll and the eyebrow pulse dot are the ONLY continuously-looping animations on the page — don't add motion anywhere else by default

- The gradient-style color transitions, floating/bobbing effects etc. are reserved for hero-only; keep every other section flat and static

- All animations must respect `prefers-reduced-motion: reduce` and turn off completely when set

- Hover states: buttons lift slightly (translateY -2px) and darken; nav links get a small underline animation on hover




## Content rules — important

- Every number, date, location, and governance fact that isn't confirmed must be visually marked as a placeholder (em-dash, "placeholder" label, or muted italic caption) — do not invent realistic-sounding fake statistics anywhere, including in code comments or fallback content

- Mascot/pose illustrations throughout are placeholders (simple geometric silhouettes) until final illustration assets are supplied — leave clear code comments wherever a placeholder graphic is used so they're easy to find and swap later

- English only, no i18n scaffolding needed yet




## Responsive behavior

- Breakpoints: desktop (>980px), tablet (720–980px), mobile (<720px)

- Stat grid and card rows collapse from 4/3 columns to 2 columns on tablet, 1 column on mobile

- Marquee strip continues to work at all sizes (icons may shrink slightly on mobile)

- Nav collapses to hamburger below 720px




## Accessibility

- Visible keyboard focus states on all interactive elements

- Sufficient color contrast on all text (verify orange backgrounds always pair with dark text, never white)

- `prefers-reduced-motion` respected everywhere as noted above

- Alt text on all icons/illustrations describing the pose or purpose, even placeholders

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://iysf-federation-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/06481cc8-2738-45e9-8eba-f35381b14ff6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
