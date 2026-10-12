<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- CMS staff access is the `staff` row in `public.user_roles`, checked via `has_role()` in RLS and server functions — never from client storage or profile fields.
- Post content is stored as a JSON block array (`src/lib/blocks.ts`) and rendered by `BlockRenderer` only — no raw HTML, embeds limited to YouTube/Vimeo, so content stays safe.
- The `media` bucket is private (workspace blocks public buckets); images are served through `/api/public/media/*`, so stored URLs use that path.
- Public news reads go through server functions with the publishable client; scheduled posts become public by RLS once `published_at <= now()`, so no cron is needed.
- Public sign-up is disabled; staff are added only by invitation from /admin/staff.
