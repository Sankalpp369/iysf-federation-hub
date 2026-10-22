-- Staff-managed content for the public Rules & Regulations page.
-- Safe to rerun: schema objects and named policies are created or replaced idempotently.

-- Create rule documents and download cards.
CREATE TABLE IF NOT EXISTS public.cms_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'document' CHECK (kind IN ('document', 'download')),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  accent text NOT NULL DEFAULT '#4298D3',
  availability text NOT NULL DEFAULT '',
  tone text NOT NULL DEFAULT 'neutral' CHECK (tone IN ('success', 'warning', 'neutral')),
  description text NOT NULL DEFAULT '',
  download_url text,
  display_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Add the public display-order index if it is not already present.
CREATE INDEX IF NOT EXISTS cms_rules_public_idx ON public.cms_rules (display_order) WHERE visible;

-- Allow public reads of visible rules and grant staff database operations.
GRANT SELECT ON public.cms_rules TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cms_rules TO authenticated;
GRANT ALL ON public.cms_rules TO service_role;

-- Enable row-level security for the rulebook content.
ALTER TABLE public.cms_rules ENABLE ROW LEVEL SECURITY;

-- Replace the public visibility policy.
DROP POLICY IF EXISTS "Public reads visible rules" ON public.cms_rules;
CREATE POLICY "Public reads visible rules" ON public.cms_rules
  FOR SELECT TO anon, authenticated
  USING (visible OR public.has_role(auth.uid(), 'staff'));

-- Replace the staff-only insert policy.
DROP POLICY IF EXISTS "Staff inserts rules" ON public.cms_rules;
CREATE POLICY "Staff inserts rules" ON public.cms_rules
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'staff'));

-- Replace the staff-only update policy.
DROP POLICY IF EXISTS "Staff updates rules" ON public.cms_rules;
CREATE POLICY "Staff updates rules" ON public.cms_rules
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'staff'));

-- Replace the staff-only delete policy.
DROP POLICY IF EXISTS "Staff deletes rules" ON public.cms_rules;
CREATE POLICY "Staff deletes rules" ON public.cms_rules
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'));

-- Keep updated_at current on edits.
CREATE OR REPLACE FUNCTION public.cms_rules_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Recreate the timestamp trigger without changing any rule content.
DROP TRIGGER IF EXISTS cms_rules_touch ON public.cms_rules;
CREATE TRIGGER cms_rules_touch BEFORE UPDATE ON public.cms_rules
  FOR EACH ROW EXECUTE FUNCTION public.cms_rules_touch_updated_at();

-- Seed the current public rule documents and download cards once; existing edits are preserved.
INSERT INTO public.cms_rules
  (kind, slug, title, content, accent, availability, tone, description, download_url, display_order, visible)
VALUES
  ('document', 'judging-criteria', 'Judging Criteria', 'IYSF judges score every posture on difficulty, minimum expression, and recommended execution, weighing balance, flexibility, and strength across the routine. Each posture is scored out of 10, with deductions for execution errors and rewards for extra skills. A panel of judges plus a dedicated time judge score every competition live, with results displayed immediately via the IYSF tabulation grid. Full scoring procedures and posture-by-posture criteria are set out in the Posture Guidelines above.', '#FAAF40', '', 'neutral', '', NULL, 10, true),
  ('document', 'athlete-eligibility', 'Athlete Eligibility', 'Athletes compete for the national federation of the country whose nationality they hold, across five age divisions: three youth groups (9–11, 12–14, 15–17), Adult (18+), and Senior (50+). National championships generate finalists who qualify for continental and world competition. Judges and coaches are certified at Local, National, or International (A-level) tiers, with A-level certification issued only by IYSF.', '#4298D3', '', 'neutral', '', NULL, 20, true),
  ('document', 'competition-format', 'Competition Format', 'Each athlete performs a routine of six postures — one from each of the six compulsory groups (backbends, forward compressions, tractions, twists, lifts, and inversions) — within a three-minute time limit. Postures must be held in stillness for at least three seconds to score, with a maximum score requiring a five-second hold. Athletes submit their routine and posture order at registration.', '#414042', '', 'neutral', '', NULL, 30, true),
  ('download', 'posture-guidelines', 'Posture Guidelines', '', '#4298D3', 'Current — used through the 2026 World Championship', 'success', 'Judging criteria, athlete eligibility, and competition format for all IYSF-sanctioned events.', NULL, 40, true),
  ('download', 'new-rulebook-2027', 'New Rulebook 2027', '', '#4298D3', 'Effective from the 2027 season', 'warning', 'Updated rules with tracked changes, replacing the Posture Guidelines from 2027 onward.', NULL, 50, true),
  ('download', 'coaching-manual', 'Coaching Manual', '', '#4298D3', 'Reference guide', 'Posture-by-posture coaching drills and progressions for IYSF-certified coaches.', NULL, 60, true)
ON CONFLICT (slug) DO NOTHING;

-- Refresh PostgREST after adding the CMS rules table.
NOTIFY pgrst, 'reload schema';
