CREATE TABLE IF NOT EXISTS public.donation_pledges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  email text NOT NULL,
  amount text,
  frequency text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.donation_pledges TO anon;
GRANT SELECT, INSERT ON public.donation_pledges TO authenticated;
GRANT ALL ON public.donation_pledges TO service_role;

ALTER TABLE public.donation_pledges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a donation pledge" ON public.donation_pledges;
CREATE POLICY "Anyone can submit a donation pledge"
  ON public.donation_pledges FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.newsletter_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.newsletter_signups TO anon;
GRANT SELECT, INSERT ON public.newsletter_signups TO authenticated;
GRANT ALL ON public.newsletter_signups TO service_role;

ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can sign up for updates" ON public.newsletter_signups;
CREATE POLICY "Anyone can sign up for updates"
  ON public.newsletter_signups FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
