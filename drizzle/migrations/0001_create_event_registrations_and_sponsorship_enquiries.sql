CREATE TABLE IF NOT EXISTS public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug text,
  event_name text NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  federation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.event_registrations TO anon;
GRANT SELECT, INSERT ON public.event_registrations TO authenticated;
GRANT ALL ON public.event_registrations TO service_role;

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit an event registration" ON public.event_registrations;
CREATE POLICY "Anyone can submit an event registration"
  ON public.event_registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.sponsorship_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  country text,
  interest text NOT NULL,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.sponsorship_enquiries TO anon;
GRANT SELECT, INSERT ON public.sponsorship_enquiries TO authenticated;
GRANT ALL ON public.sponsorship_enquiries TO service_role;

ALTER TABLE public.sponsorship_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a sponsorship enquiry" ON public.sponsorship_enquiries;
CREATE POLICY "Anyone can submit a sponsorship enquiry"
  ON public.sponsorship_enquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
