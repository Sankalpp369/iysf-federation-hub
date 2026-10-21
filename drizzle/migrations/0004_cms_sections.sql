-- CMS Phase 2: staff managed site sections.
CREATE TABLE public.cms_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  location text NOT NULL DEFAULT '',
  description jsonb NOT NULL DEFAULT '[]'::jsonb,
  cover_image_url text,
  cover_alt text,
  registration_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR ends_at >= starts_at)
);
CREATE INDEX cms_events_public_idx ON public.cms_events (starts_at) WHERE status = 'published';

CREATE TABLE public.cms_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  competition_date date NOT NULL,
  location text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  rows jsonb NOT NULL DEFAULT '[]'::jsonb,
  official_sheet_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX cms_results_public_idx ON public.cms_results (competition_date DESC) WHERE status = 'published';

CREATE TABLE public.cms_officials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role_title text NOT NULL,
  country text NOT NULL DEFAULT '',
  photo_url text,
  bio text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.cms_homepage (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  hero_image_url text,
  hero_alt text NOT NULL DEFAULT '',
  headline text NOT NULL DEFAULT '',
  button_text text NOT NULL DEFAULT '',
  button_url text NOT NULL DEFAULT '',
  intro_text text NOT NULL DEFAULT '',
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO public.cms_homepage (id) VALUES (true) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.federation_applications ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewed','approved','rejected'));
ALTER TABLE public.federation_applications ADD COLUMN IF NOT EXISTS internal_notes text NOT NULL DEFAULT '';
ALTER TABLE public.federation_applications ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['cms_events','cms_results','cms_officials','cms_homepage'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    IF t = 'cms_events' OR t = 'cms_results' THEN
      EXECUTE format('CREATE POLICY "Public reads published content" ON public.%I FOR SELECT TO anon, authenticated USING (public.has_role(auth.uid(), ''staff'') OR status = ''published'')', t);
    ELSIF t = 'cms_officials' THEN
      EXECUTE format('CREATE POLICY "Public reads published content" ON public.%I FOR SELECT TO anon, authenticated USING (public.has_role(auth.uid(), ''staff'') OR visible)', t);
    ELSIF t = 'cms_homepage' THEN
      EXECUTE format('CREATE POLICY "Public reads published content" ON public.%I FOR SELECT TO anon, authenticated USING (true)', t);
    END IF;
    EXECUTE format('CREATE POLICY "Staff writes content" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''staff''))', t);
    EXECUTE format('CREATE POLICY "Staff updates content" ON public.%I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''staff'')) WITH CHECK (public.has_role(auth.uid(), ''staff''))', t);
    EXECUTE format('CREATE POLICY "Staff deletes content" ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''staff''))', t);
  END LOOP;
END $$;

-- Applications remain in the existing public form table; all staff management is role checked.
ALTER TABLE public.federation_applications ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.federation_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.federation_applications TO authenticated;
CREATE POLICY "Anyone may submit an application" ON public.federation_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff reads applications" ON public.federation_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'staff'));
CREATE POLICY "Staff updates applications" ON public.federation_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'staff')) WITH CHECK (public.has_role(auth.uid(),'staff'));
CREATE POLICY "Staff deletes applications" ON public.federation_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'staff'));

CREATE TRIGGER cms_events_touch BEFORE UPDATE ON public.cms_events FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER cms_results_touch BEFORE UPDATE ON public.cms_results FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER cms_officials_touch BEFORE UPDATE ON public.cms_officials FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER federation_applications_touch BEFORE UPDATE ON public.federation_applications FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
