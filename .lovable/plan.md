# Rules, Forms, Authentication, and Email Delivery

## Rules page
- Keep the existing page header, navigation, footer, search, and desktop/mobile Contents styling unchanged.
- Remove Anti-Doping Policy and Code of Conduct from the searchable content and both Contents lists.
- Add three flat, responsive document cards: Posture Guidelines, New Rulebook 2027, and Coaching Manual. Use the requested status treatments, descriptions, file icons, and disabled placeholder download controls.
- Replace the three remaining rule sections with the supplied final text while preserving their current anchors and heading treatment. Update page copy and metadata so it no longer claims five documents or references removed policies.

## Forms and stored submissions
- Inventory and connect every current visitor form: federation/contact inquiries, event registration modal, event detail registration, championship updates, history updates, donation pledges, and sponsorship inquiries.
- Give Contact and Sponsorship purpose-built forms instead of reusing a membership form or dead links.
- Validate submissions, save each successful submission in Lovable Cloud, show honest loading/success/error states, and prevent UI-only success messages.
- Extend the existing backend schema only where current fields are insufficient, with locked-down row access and submit-only public permissions.

## Authentication
- Keep email/password and Google sign-in enabled and verify sign-in, account creation/profile creation, password-reset request, reset completion path, protected dashboard access, and sign-out.
- Confirm profile records are created from account details and that protected data remains user-scoped.

## Email delivery
- Configure branded app-email support after an owned sender domain is selected and verified.
- Add fixed-recipient notification templates for contact and sponsorship submissions, sent only from trusted server code to `sponsors@iysf.org`, with unique submission IDs preventing duplicates.
- Save the inquiry before sending; report delivery failure honestly rather than claiming success, while retaining the saved submission for follow-up.
- Verify a real contact and sponsorship submission appears in the database and produces a successful send event to `sponsors@iysf.org`.

## Verification
- Test every form in the live preview and confirm corresponding database rows.
- Test authentication with a real test session/account where possible, including dashboard protection and sign-out.
- Check Rules page behavior and layout at desktop and mobile widths.
- Run focused checks and report any external blocker separately.

## Required user action
- No sender domain is configured. App emails cannot be sent until a real domain you own is connected and verified; built-in account confirmation/reset emails can still use the default sender.
