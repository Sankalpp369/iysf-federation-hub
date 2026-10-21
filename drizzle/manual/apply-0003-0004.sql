-- Manual, rerunnable equivalent of migrations 0003 and 0004.
-- Apply only after migrations 0000-0002, including federation_applications, are present.
-- IF NOT EXISTS skips existing tables; it does not repair a table with missing columns.

-- Create the staff role enum, or stop safely if a conflicting enum already exists.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typname = 'app_role'
  ) THEN
    CREATE TYPE public.app_role AS ENUM ('staff');
  ELSIF NOT EXISTS (
    SELECT 1 FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
      JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE n.nspname = 'public' AND t.typname = 'app_role' AND e.enumlabel = 'staff'
  ) THEN
    RAISE EXCEPTION 'public.app_role exists without the staff value; reconcile it before continuing';
  END IF;
END
$$;

-- Create staff-role assignments with a cascading reference to Auth users.
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Grant role reads to signed-in users and administrative access to the server role.
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- Enable row-level security for staff-role assignments.
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Define the SECURITY DEFINER role check used by RLS policies.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Replace the role-read policy with the expected self-or-staff rule.
DROP POLICY IF EXISTS "Users see own roles; staff see all" ON public.user_roles;
CREATE POLICY "Users see own roles; staff see all"
  ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'staff'));

-- Create JSON-block news posts and their publication metadata.
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  cover_image_url text,
  cover_alt text,
  content jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  published_at timestamptz,
  tags text[] NOT NULL DEFAULT '{}',
  seo_title text,
  seo_description text,
  author_name text,
  created_by uuid,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index posts for publication status and descending publication date.
CREATE INDEX IF NOT EXISTS posts_pub_idx ON public.posts (status, published_at DESC);

-- Grant public post reads, staff CRUD, and server-role access.
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;

-- Enable row-level security on posts.
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Replace the public policy for posts whose publication time has arrived.
DROP POLICY IF EXISTS "Public reads live posts" ON public.posts;
CREATE POLICY "Public reads live posts" ON public.posts FOR SELECT TO anon, authenticated
  USING (status IN ('published', 'scheduled') AND published_at IS NOT NULL AND published_at <= now());

-- Replace staff-only visibility for all posts.
DROP POLICY IF EXISTS "Staff read all posts" ON public.posts;
CREATE POLICY "Staff read all posts" ON public.posts FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'staff'));

-- Replace staff-only post creation policy.
DROP POLICY IF EXISTS "Staff insert posts" ON public.posts;
CREATE POLICY "Staff insert posts" ON public.posts FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'staff'));

-- Replace staff-only post update policy.
DROP POLICY IF EXISTS "Staff update posts" ON public.posts;
CREATE POLICY "Staff update posts" ON public.posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'staff')) WITH CHECK (public.has_role(auth.uid(), 'staff'));

-- Replace staff-only post deletion policy.
DROP POLICY IF EXISTS "Staff delete posts" ON public.posts;
CREATE POLICY "Staff delete posts" ON public.posts FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'staff'));

-- Define the shared updated_at trigger function.
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Recreate the post timestamp trigger without changing post rows.
DROP TRIGGER IF EXISTS posts_touch ON public.posts;
CREATE TRIGGER posts_touch BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Create private-bucket media metadata.
CREATE TABLE IF NOT EXISTS public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL UNIQUE,
  url text NOT NULL,
  alt text,
  width int,
  height int,
  size_bytes int,
  mime_type text,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Grant signed-in CMS users media CRUD and server-role access.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;

-- Enable row-level security on media metadata.
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- Replace staff-only media metadata management policy.
DROP POLICY IF EXISTS "Staff manage media" ON public.media;
CREATE POLICY "Staff manage media" ON public.media FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'staff')) WITH CHECK (public.has_role(auth.uid(), 'staff'));

-- Replace staff-only read access to objects in the private media bucket.
DROP POLICY IF EXISTS "Staff read media objects" ON storage.objects;
CREATE POLICY "Staff read media objects" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'staff'));

-- Replace staff-only uploads to the private media bucket.
DROP POLICY IF EXISTS "Staff upload media" ON storage.objects;
CREATE POLICY "Staff upload media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'staff'));

-- Replace staff-only updates to objects in the private media bucket.
DROP POLICY IF EXISTS "Staff update media" ON storage.objects;
CREATE POLICY "Staff update media" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'staff'));

-- Replace staff-only deletion of objects in the private media bucket.
DROP POLICY IF EXISTS "Staff delete media" ON storage.objects;
CREATE POLICY "Staff delete media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'staff'));

-- Insert sample news posts once; existing rows with these slugs are left untouched.
INSERT INTO public.posts (title, slug, excerpt, content, status, published_at, tags, author_name)
VALUES
  ('Welcome to the new IYSF newsroom', 'welcome-to-the-new-iysf-newsroom',
   'Sample article: federation news, championship updates and Academy announcements will now be published here.',
   '[{"id":"b1","type":"paragraph","text":"This is a sample article created to show how the new IYSF newsroom works. Staff can now publish news straight from the admin area."},{"id":"b2","type":"heading","level":2,"text":"What you will find here"},{"id":"b3","type":"list","ordered":false,"items":["Championship announcements","Federation membership news","Academy and certification updates"]},{"id":"b4","type":"callout","text":"Sample content - replace or delete this post before launch."}]'::jsonb,
   'published', now() - interval '2 days', ARRAY['Announcements'], 'IYSF Communications'),
  ('Sample: preparing for the World Championship 2026', 'sample-preparing-for-world-championship-2026',
   'Sample article showing quotes, dividers and buttons inside a news post.',
   '[{"id":"c1","type":"paragraph","text":"Sample text: national federations are finalising their delegations for the upcoming World Championship."},{"id":"c2","type":"quote","text":"Every pose codified, every athlete certified.","attribution":"IYSF"},{"id":"c3","type":"divider"},{"id":"c4","type":"button","label":"View the championship","href":"/events/world-championship-2026"}]'::jsonb,
   'published', now() - interval '1 day', ARRAY['Championships','Sample'], 'IYSF Communications'),
  ('Draft: Academy recertification update', 'draft-academy-recertification-update',
   'Sample draft - only visible to staff.',
   '[{"id":"d1","type":"paragraph","text":"This draft is only visible inside the admin area."}]'::jsonb,
   'draft', NULL, ARRAY['Academy'], 'IYSF Academy')
ON CONFLICT (slug) DO NOTHING;

-- 0004_cms_sections.sql

-- Create staff-managed events.
CREATE TABLE IF NOT EXISTS public.cms_events (
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
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR ends_at >= starts_at)
);

-- Index published events by start date.
CREATE INDEX IF NOT EXISTS cms_events_public_idx ON public.cms_events (starts_at) WHERE status = 'published';

-- Create staff-managed competition results.
CREATE TABLE IF NOT EXISTS public.cms_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_name text NOT NULL,
  slug text NOT NULL UNIQUE,
  competition_date date NOT NULL,
  location text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  rows jsonb NOT NULL DEFAULT '[]'::jsonb,
  official_sheet_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index published results by descending competition date.
CREATE INDEX IF NOT EXISTS cms_results_public_idx ON public.cms_results (competition_date DESC) WHERE status = 'published';

-- Create staff-managed officials.
CREATE TABLE IF NOT EXISTS public.cms_officials (
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

-- Create the singleton homepage settings row.
CREATE TABLE IF NOT EXISTS public.cms_homepage (
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

-- Create the default homepage row only if it is absent.
INSERT INTO public.cms_homepage (id) VALUES (true) ON CONFLICT (id) DO NOTHING;

-- Add application review status without replacing existing values.
ALTER TABLE public.federation_applications
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new'
  CHECK (status IN ('new', 'reviewed', 'approved', 'rejected'));

-- Add staff-only notes to applications when absent.
ALTER TABLE public.federation_applications
  ADD COLUMN IF NOT EXISTS internal_notes text NOT NULL DEFAULT '';

-- Add application update timestamps when absent.
ALTER TABLE public.federation_applications
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Grant permissions, enable RLS, and replace read/write policies on each CMS section table.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['cms_events', 'cms_results', 'cms_officials', 'cms_homepage'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Public reads published content', t);
    IF t IN ('cms_events', 'cms_results') THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (public.has_role(auth.uid(), ''staff'') OR status = ''published'')', 'Public reads published content', t);
    ELSIF t = 'cms_officials' THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (public.has_role(auth.uid(), ''staff'') OR visible)', 'Public reads published content', t);
    ELSE
      EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT TO anon, authenticated USING (true)', 'Public reads published content', t);
    END IF;

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Staff writes content', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''staff''))', 'Staff writes content', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Staff updates content', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''staff'')) WITH CHECK (public.has_role(auth.uid(), ''staff''))', 'Staff updates content', t);

    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'Staff deletes content', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''staff''))', 'Staff deletes content', t);
  END LOOP;
END
$$;

-- Enable RLS and grant public form submission plus staff application management.
ALTER TABLE public.federation_applications ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.federation_applications TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.federation_applications TO authenticated;

-- Allow public application inserts.
DROP POLICY IF EXISTS "Anyone may submit an application" ON public.federation_applications;
CREATE POLICY "Anyone may submit an application" ON public.federation_applications
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Allow staff to list applications.
DROP POLICY IF EXISTS "Staff reads applications" ON public.federation_applications;
CREATE POLICY "Staff reads applications" ON public.federation_applications
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'staff'));

-- Allow staff to update applications.
DROP POLICY IF EXISTS "Staff updates applications" ON public.federation_applications;
CREATE POLICY "Staff updates applications" ON public.federation_applications
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'staff'));

-- Allow staff to delete applications.
DROP POLICY IF EXISTS "Staff deletes applications" ON public.federation_applications;
CREATE POLICY "Staff deletes applications" ON public.federation_applications
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'staff'));

-- Recreate update timestamps for CMS events without changing event data.
DROP TRIGGER IF EXISTS cms_events_touch ON public.cms_events;
CREATE TRIGGER cms_events_touch BEFORE UPDATE ON public.cms_events
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Recreate update timestamps for CMS results without changing result data.
DROP TRIGGER IF EXISTS cms_results_touch ON public.cms_results;
CREATE TRIGGER cms_results_touch BEFORE UPDATE ON public.cms_results
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Recreate update timestamps for officials without changing official data.
DROP TRIGGER IF EXISTS cms_officials_touch ON public.cms_officials;
CREATE TRIGGER cms_officials_touch BEFORE UPDATE ON public.cms_officials
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Recreate update timestamps for applications without changing application data.
DROP TRIGGER IF EXISTS federation_applications_touch ON public.federation_applications;
CREATE TRIGGER federation_applications_touch BEFORE UPDATE ON public.federation_applications
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Ask PostgREST to refresh its schema cache after these schema changes.
NOTIFY pgrst, 'reload schema';
